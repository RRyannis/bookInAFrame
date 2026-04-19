import "./update.scss";
import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "../../supabaseClient";

const Update = ({ setOpenUpdate, user }) => {
    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    
    // Aligned with your actual DB columns: full_name, username, website
    const [texts, setTexts] = useState({
        full_name: user?.full_name || "",
        username: user?.username || "",
        website: user?.website || "",
    });

    const queryClient = useQueryClient();

    const handleChange = (e) => {
        setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Helper: Supabase Storage Upload
    const uploadFile = async (file) => {
        try {
            const fileName = `${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('bookInAFrameStorage') 
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('bookInAFrameStorage')
                .getPublicUrl(fileName);

            return data.publicUrl;
        } catch (err) {
            console.error("Upload error:", err);
            return null;
        }
    };

    // Mutation: Update Profiles Table
    const mutation = useMutation({
        mutationFn: async (updatedUser) => {
            const { error } = await supabase
                .from("profiles")
                .update({
                    ...updatedUser,
                    updated_at: new Date().toISOString(), // Standard practice
                })
                .eq("id", user.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            setOpenUpdate(false);
        },
    });

    const handleClick = async (e) => {
        e.preventDefault();

        // Use existing URLs if no new files are selected
        let coverUrl = cover ? await uploadFile(cover) : user.cover_url;
        let profileUrl = profile ? await uploadFile(profile) : user.avatar_url;

        mutation.mutate({
            ...texts,
            cover_url: coverUrl,
            avatar_url: profileUrl,
        });
    };

    return (
        <div className="update">
            <div className="wrapper">
                <h1>Update Your Profile</h1>
                <form>
                    <div className="files">
                        <label htmlFor="cover">
                            <span>Cover Picture</span>
                            <div className="imgContainer">
                                <img src={cover ? URL.createObjectURL(cover) : (user.cover_url || "https://via.placeholder.com/300x100")} alt="Cover" />
                            </div>
                        </label>
                        <input type="file" id="cover" style={{ display: "none" }} onChange={e => setCover(e.target.files[0])} />
                        
                        <label htmlFor="profile">
                            <span>Profile Picture</span>
                            <div className="imgContainer">
                                <img src={profile ? URL.createObjectURL(profile) : (user.avatar_url || "https://via.placeholder.com/100")} alt="Profile" />
                            </div>
                        </label>
                        <input type="file" id="profile" style={{ display: "none" }} onChange={e => setProfile(e.target.files[0])} />
                    </div>

                    <label>Full Name</label>
                    <input type="text" name="full_name" value={texts.full_name} onChange={handleChange} />
                    
                    <label>Username</label>
                    <input type="text" name="username" value={texts.username} onChange={handleChange} />
                    
                    <label>Website</label>
                    <input type="text" name="website" value={texts.website} onChange={handleChange} />
                    
                    <button onClick={handleClick} disabled={mutation.isPending}>
                        {mutation.isPending ? "Updating..." : "Update"}
                    </button>
                </form>
                <button className="close" onClick={() => setOpenUpdate(false)}>X</button>
            </div>
        </div>
    );
};

export default Update;
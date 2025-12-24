import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "../../supabaseClient";

const Share = () => {

  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const TEMP_BOOK_ID = '48342c9c-4c4b-45ba-8f07-24ea8f7e6524';

  const uploadFile = async (file) => {
    if (!file) return null;

    const fileName = `${Date.now()}_${file.name}`;
    const { _data, error } = await supabase.storage
        .from('bookInAFrameStorage')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error("Supabase Storage Upload Error:", error);
        throw new Error(error.message);
    }
    const { data: publicUrlData } = supabase.storage
        .from('bookInAFrameStorage')
        .getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const queryClient = useQueryClient();

 
  const postMutation = useMutation({
    mutationFn: async (newPost) => {
        // newPost structure will be { caption, image_url, user_id, book_id, etc. }
        const { error } = await supabase.from("posts").insert([newPost]);

        if (error) {
            console.error("Supabase Post Insert Error:", error);
            throw new Error(error.message);
        }
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
});

  const {currentUser} = useContext(AuthContext)

  const handleClick = async (e) => {
    e.preventDefault();
    if (!desc.trim() && !file) return;
    let imageUrl = "";
    try {
        if (file) {
            imageUrl = await uploadFile(file);
        }
    } catch (err) {
        console.error("Upload failed, cancelling post:", err);
        return; 
    }
    
   
    postMutation.mutate({ 
        caption: desc, 
        image_url: imageUrl, 
        user_id: currentUser.id, 
        book_id: TEMP_BOOK_ID,
        visibility: 'public' 
    });
    
    setDesc("");
    setFile(null);
};

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
          {/* FIX 1: Safely access the avatar_url property */}
            <img 
                src={currentUser?.avatar_url || 'default_placeholder_image_url'} 
                alt="" 
            />
            <input 
                type="text" 
                placeholder={`What's on your mind ${currentUser?.full_name || currentUser?.username}?`} 
                onChange={(e)=>setDesc(e.target.value)} 
                value={desc}
            />
          </div>
          <div className="right">
            {file && <img className="file" alt="" src={URL.createObjectURL(file)}/>}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} onChange={e=>setFile(e.target.files[0])}/>
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
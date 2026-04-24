import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { supabase } from "../../supabaseClient";
import { useFollow } from "../../hooks/useFollow";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { username } = useParams();
  const queryClient = useQueryClient();

  // Fetch profile by username
  const { isLoading, data: profileData } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, cover_url, website")
        .eq("username", username)
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
  });

  // Fetch relationship
  const { data: relationshipData } = useQuery({
    queryKey: ["relationship", profileData?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("relationships")
        .select("id")
        .eq("followerUserId", currentUser.id)
        .eq("followedUserId", profileData.id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!profileData?.id && !!currentUser?.id
  });

  const isFollowing = !!relationshipData;
  const isOwnProfile = currentUser?.id === profileData?.id;

  // Follow / unfollow mutation
  // const { mutate: toggleFollow } = useMutation({
  //   mutationFn: async () => {
  //     if (isFollowing) {
  //       const { error } = await supabase
  //         .from("relationships")
  //         .delete()
  //         .eq("followerUserId", currentUser.id)
  //         .eq("followedUserId", profileData.id);
  //       if (error) throw new Error(error.message);
  //     } else {
  //       const { error } = await supabase
  //         .from("relationships")
  //         .insert({ followerUserId: currentUser.id, followedUserId: profileData.id });
  //       if (error) throw new Error(error.message);
  //     }
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["relationship", profileData?.id] });
  //   }
  // });
  const { toggleFollow, isPending } = useFollow(profileData.id, isFollowing);

  if (isLoading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>;
  if (!profileData) return <div style={{ padding: "50px", textAlign: "center" }}>User not found.</div>;

  return (
    <div className="profile">
      <div className="images">
        <img
          src={profileData.cover_url || "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg"}
          alt=""
          className="cover"
        />
        <img
          src={profileData.avatar_url || "https://via.placeholder.com/200"}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            {profileData.website && (
              <div className="item">
                <LanguageIcon />
                <span>{profileData.website}</span>
              </div>
            )}
          </div>
          <div className="center">
            <span>{profileData.full_name || profileData.username}</span>
            <div className="info">
              <div className="item">
                <LanguageIcon />
                <span>{profileData.website || "—"}</span>
              </div>
            </div>
            {isOwnProfile
              ? <button onClick={() => setOpenUpdate(true)}>Update profile</button>
              : <button onClick={toggleFollow} disabled={isPending}>
                  {isFollowing ? "Following" : "Follow"}
                </button>
            }
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={profileData.id} />
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={profileData} />}
    </div>
  );
};

export default Profile;
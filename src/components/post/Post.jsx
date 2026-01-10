import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext } from "react";
import moment from "moment";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from "../../context/authContext";
import { supabase } from "../../supabaseClient";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { isLoading, error: _error, data: likesData } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: async () => {
      const { data: supabaseData, error: fetchError } = await supabase.from("likes").select("userId").eq("postId", post.id);
      if (fetchError) {
        console.error("Supabase likes fetch error:", fetchError);
        throw new Error(fetchError.message);
      }
      return supabaseData.map(like => like.userId);
    }
  });

  const { currentUser } = useContext(AuthContext);
  const currentUserId = currentUser?.id;

  const queryClient = useQueryClient();

  const { mutate: toggleLikeMutation, isPending } = useMutation({
    mutationFn: async (isCurrentlyLiked) => {
      if (!currentUserId) {
        throw new Error("User not authenticated");
      }
      console.log("Like mutation: userId =", currentUserId, "postId =", post.id, "isLiked =", isCurrentlyLiked);
      if (isCurrentlyLiked) {
        const { error } = await supabase.from("likes").delete().eq("postId", post.id).eq("userId", currentUserId);
        if (error) {
          console.error("Like delete error:", error);
          throw new Error(error.message);
        }
      } else {
        const { error } = await supabase.from("likes").insert({ postId: post.id, userId: currentUserId });
        if (error) {
          console.error("Like insert error:", error);
          throw new Error(error.message);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", post.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    toggleLikeMutation(likesData?.includes(currentUserId));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profile.avatar_url} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.user_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.profile.full_name || post.profile.username}</span>
              </Link>
              <span className="date">{moment(post.created_at).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {(menuOpen && post.user_id === currentUserId) && <button onClick={handleDelete}>delete</button>}
        </div>
        <div className="content">
          <p>{post.caption}</p>
          <img src={post.image_url} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? "loading" : (
              <button
                onClick={handleLike}
                disabled={isPending}
                className="likeButton"
              >
                {likesData.includes(currentUserId) ? (
                  <FavoriteOutlinedIcon style={{ color: "blue" }} />
                ) : (
                  <FavoriteBorderOutlinedIcon />
                )}
              </button>
            )}
            {likesData?.length || 0} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;




// const mutation = useMutation(
//     (liked) => {
//       if (liked) return makeRequest.delete("/likes?postId=" + post.id);
//       return makeRequest.post("/likes", { postId: post.id });
//     },
//     {
//       onSuccess: () => {
//         // Invalidate and refetch
//         queryClient.invalidateQueries(["likes"]);
//       },
//     }
//   );
//   const deleteMutation = useMutation(
//     (postId) => {
//       return makeRequest.delete("/posts/" + postId);
//     },
//     {
//       onSuccess: () => {
//         // Invalidate and refetch
//         queryClient.invalidateQueries(["posts"]);
//       },
//     }
//   );

//   const handleLike = () => {
//     mutation.mutate(data.includes(currentUser.id));
//   };

//   const handleDelete = () => {
//     deleteMutation.mutate(post.id);
//   };
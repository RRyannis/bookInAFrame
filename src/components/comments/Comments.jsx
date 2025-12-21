import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moment from "moment";
import { supabase } from "../../supabaseClient";

const Comments = ({ postId }) => {
  const [ commentDesc, setCommentDesc] = useState("");

  const { currentUser } = useContext(AuthContext);
  

   const { isLoading, error: _error, data: commentsData } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data: supabaseData, error: fetchError } = await supabase.from("comments").select(`*, 
            profile:userId (username, avatar_url)
        `).eq("postId", postId).order('createdAt', { ascending: false });;
      if(fetchError){
        console.error("Supabase likes fetch error:", fetchError);
        throw new Error(fetchError.message);
      }
      return supabaseData;
    }
  });

   const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: async (newComment)=>{
      const { error } = await supabase.from("comments").insert([newComment]);

      if (error) {
        console.error("Supabase comment insert error:", error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  })


  const handleClick = async (e) => {
    e.preventDefault();
    if (!currentUser?.id || !commentDesc.trim()) return;
    addCommentMutation.mutate({ desc: commentDesc,userId:currentUser.id, postId: postId });
    setCommentDesc("");
    
  };


  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.avatar_url} alt="" />
        <input type="text" placeholder="write a comment" value={commentDesc }onChange={e=>setCommentDesc(e.target.value)}/>
        <button onClick={handleClick}>Send</button>
      </div>
      { isLoading? "loading" : 
      commentsData.map((comment) => (
        <div className="comment">
          <img src={comment.profile.avatar_url} alt="" />
          <div className="info">
            <span>{comment.profile.username}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
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
      const { data: supabaseData, error: fetchError } = await supabase.from("comments").select().eq("postId", postId);
      if(fetchError){
        console.error("Supabase likes fetch error:", fetchError);
        throw new Error(fetchError.message);
      }
      return supabaseData.map(comment => comment.userId);
    }
  });

   const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment)=>{
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["comments"])
    },
  })


  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc: commentDesc, postId: postId });
    setCommentDesc("");
    
  };


  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" value={commentDesc }onChange={e=>setCommentDesc(e.target.value)}/>
        <button onClick={handleClick}>Send</button>
      </div>
      { isLoading? "loading" : 
      data.map((comment) => (
        <div className="comment">
          <img src={comment.profilePic} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
// fake asf change
import Post from "../post/Post";
import './posts.scss';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { supabase } from "../../supabaseClient";
import { AuthContext } from "../../context/authContext";

const Posts = ({ userId, feedType = "all", emptyMessage = "No posts yet. Be the first to share a passage!" }) => {
  const { currentUser } = useContext(AuthContext);

  const { data: followingData } = useQuery({
    queryKey: ["following", currentUser.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("relationships")
        .select("followedUserId")
        .eq("followerUserId", currentUser.id);
      if (error) throw new Error(error.message);
      return data.map(r => r.followedUserId);
    },
    enabled: feedType === "following"
  });

  const { isLoading, error, data: postsData } = useQuery({
    queryKey: ["posts", userId, feedType, followingData],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *, 
          profile:user_id (username, avatar_url, full_name),
          book:book_id (title, authors, thumbnail_url)
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      } else if (feedType === "following" && followingData) {
        if (followingData.length === 0) return [];
        query = query.in("user_id", followingData);
      } else {
        query = query.limit(10);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw new Error(fetchError.message);
      return data;
    },
    enabled: feedType === "all" || (feedType === "following" && !!followingData || !!userId)
  });

  return (
    <div className="posts">
      {error ? "Something went wrong!" :
        isLoading ? "is loading" :
        postsData?.length === 0 ?
        <div className="emptyState">
          <p>{feedType === "following" ? "No posts from people you follow yet." : emptyMessage}</p>
        </div> :
        postsData?.map((post) => (
          <Post post={post} key={post.id} />
        ))}
    </div>
  );
};

export default Posts;
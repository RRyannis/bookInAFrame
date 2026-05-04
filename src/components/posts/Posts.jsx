import Post from "../post/Post";
import './posts.scss';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "../../supabaseClient";

const Posts = ({userId, emptyMessage = "No posts yet. Be the first to share a passage!"}) => {

const { isLoading, error, data: postsData } = useQuery({
  queryKey: ["posts", userId],
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
    } else {
      query = query.limit(10);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) throw new Error(fetchError.message);
    return data;
  }
});

return (
  <div className="posts">
    {error ? "Something went wrong!" :
      (isLoading ? "is loading" :
        postsData?.length == 0 ?
        (
          <div className="emptyState">
            <p>{emptyMessage}</p>
          </div>
        ) :
        postsData?.map((post) => (
        <Post post={post} key={post.id}/>
      )))}
  </div>
);
};

export default Posts;
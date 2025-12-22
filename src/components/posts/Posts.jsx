import Post from "../post/Post";
import './posts.scss';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "../../supabaseClient";

const Posts = ({userId}) => {

const { isLoading, error, data: postsData } = useQuery({
     queryKey: ["posts"],
  queryFn: async () => {
    const { data, error: fetchError } = await supabase
      .from("posts")
      .select(`
        *, 
        profile:user_id (username, avatar_url, full_name),
        book:book_id (title, authors, thumbnail_url)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (userId) {
      const { data: userPosts, error: userFetchError } = await supabase
        .from("posts")
        .select(`
          *, 
          profile:user_id (username, avatar_url, full_name),
          book:book_id (title, authors, thumbnail_url)
        `)
        .eq("user_id", userId)
        .order('created_at', { ascending: false });

      if (userFetchError) {
        console.error("Supabase user posts fetch error:", userFetchError);
        throw new Error(userFetchError.message);
      }
      return userPosts;
    }

    if (fetchError) {
      console.error("Supabase posts fetch error:", fetchError);
      throw new Error(fetchError.message);
    }
    return data;
  }
});

console.log(postsData);

return (
  <div className="posts">
    {error ? "Something went wrong!" :
      (isLoading ? "is loading" : postsData?.map((post) => (
        <Post post={post} key={post.id}/>
      )))}
  </div>
);
};

export default Posts;
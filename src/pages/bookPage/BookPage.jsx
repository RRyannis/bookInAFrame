import "./bookPage.scss";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";
import Post from "../../components/post/Post";

const BookPage = () => {
  const { id } = useParams(); // Grabs the book UUID from the URL

  // 1. Fetch Book Details
  const { data: bookData, isLoading: bookLoading, error: bookError } = useQuery({
    queryKey: ["bookDetails", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single(); // We only expect one book record

      if (error) throw new Error(error.message);
      return data;
    },
  });

  // 2. Fetch All Posts Associated with this Book
  const { data: postsData, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ["bookPosts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profile:user_id (username, avatar_url, full_name),
          book:book_id (title, authors, thumbnail_url)
        `)
        .eq("book_id", id)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });

  if (bookLoading || postsLoading) return <div className="loading">Loading library assets...</div>;
  if (bookError || postsError) return <div className="error">Error loading book hub.</div>;

  return (
    <div className="bookPage">
      {/* Book Hub Hero Header */}
      <div className="bookHeader">
        {bookData?.thumbnail_url && (
          <img src={bookData.thumbnail_url} alt={bookData.title} className="coverImg" />
        )}
        <div className="bookMeta">
          <h1>{bookData?.title}</h1>
          <h2>by {bookData?.authors?.join(", ")}</h2>
          <span className="statsCount">
            📚 {postsData?.length || 0} Frames captured by the community
          </span>
        </div>
      </div>

      <hr />

      {/* Grid/Feed of Frames for this specific book */}
      <div className="bookFeed">
        <h3>Community Captures</h3>
        {postsData?.length === 0 ? (
          <p className="noPosts">No passages have been framed for this book yet.</p>
        ) : (
          <div className="postsContainer">
            {postsData?.map((post) => (
              <Post post={post} key={post.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPage;
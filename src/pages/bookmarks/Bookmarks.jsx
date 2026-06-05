import "./bookmarks.scss";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";
import { AuthContext } from "../../context/authContext";
import Post from "../../components/post/Post";

const Bookmarks = () => {
    const { currentUser } = useContext(AuthContext);

    const { data: bookmarksData, isLoading, error } = useQuery({
        queryKey: ["bookmarks", currentUser.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("bookmarks")
                .select(`
                    *,
                    post:post_id (
                        *,
                        profile:user_id (username, avatar_url, full_name),
                        book:book_id (title, authors, thumbnail_url)
                    )
                `)
                .eq("user_id", currentUser.id)
                .order("created_at", { ascending: false });

            if (error) throw new Error(error.message);
            return data.map(bookmark => bookmark.post);
        },
        enabled: !!currentUser?.id
    });

    return (
        <div className="bookmarks">
            <div className="bookmarksContainer">
                <h2>Saved Posts</h2>
                {error ? "Something went wrong!" :
                    isLoading ? "Loading..." :
                    bookmarksData?.length === 0 ?
                    <div className="emptyState">
                        <p>You haven't saved any posts yet.</p>
                    </div> :
                    bookmarksData?.map((post) => (
                        <Post post={post} key={post.id} />
                    ))
                }
            </div>
        </div>
    );
};

export default Bookmarks;
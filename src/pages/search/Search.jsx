import "./search.scss";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    const { data: profileResults, isLoading: profilesLoading } = useQuery({
        queryKey: ["searchProfiles", query],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, username, full_name, avatar_url")
                .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
                .limit(5);
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!query
    });

    const { data: bookResults, isLoading: booksLoading } = useQuery({
        queryKey: ["searchBooks", query],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("books")
                .select("id, title, authors, thumbnail_url")
                .textSearch("title", query, { type: "websearch" })
                .limit(5);
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!query
    });

    if (!query) return <div className="search"><p>Enter a search term.</p></div>;

    return (
        <div className="search">
            <h2>Results for "{query}"</h2>

            <div className="searchSection">
                <h3>Users</h3>
                {profilesLoading ? "Loading..." :
                    profileResults?.length === 0 ? <p className="empty">No users found.</p> :
                    profileResults?.map((profile) => (
                        <Link
                            key={profile.id}
                            to={`/profiles/${profile.username}`}
                            className="searchResult userResult"
                        >
                            <img src={profile.avatar_url || "/default-avatar.png"} alt="" />
                            <div className="resultInfo">
                                <span className="name">{profile.full_name || profile.username}</span>
                                <span className="sub">@{profile.username}</span>
                            </div>
                        </Link>
                    ))
                }
            </div>

            <div className="searchSection">
                <h3>Books</h3>
                {booksLoading ? "Loading..." :
                    bookResults?.length === 0 ? <p className="empty">No books found.</p> :
                    bookResults?.map((book) => (
                        <Link
                            key={book.id}
                            to={`/books/${book.id}`}
                            className="searchResult bookResult"
                        >
                            {book.thumbnail_url && (
                                <img src={book.thumbnail_url} alt={book.title} />
                            )}
                            <div className="resultInfo">
                                <span className="name">{book.title}</span>
                                <span className="sub">{book.authors?.join(", ")}</span>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
};

export default Search;
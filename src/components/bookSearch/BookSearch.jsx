import "./bookSearch.scss";
import { useState } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

const BookSearch = ({ onSelectBook }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5&key=${API_KEY}`
            );
            const data = await res.json();
            setResults(data.items || []);
        } catch (err) {
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelect = (item) => {
        onSelectBook({
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || [],
            thumbnail_url: item.volumeInfo.imageLinks?.thumbnail || null,
            google_books_id: item.id
        });
        setResults([]);
        setQuery("");
    };

    return (
        <div className="bookSearch">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for a book..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" disabled={isSearching}>
                    {isSearching ? "..." : "Search"}
                </button>
            </form>
            {results.length > 0 && (
                <div className="bookResults">
                    {results.map((item) => (
                        <div
                            key={item.id}
                            className="bookResult"
                            onClick={() => handleSelect(item)}
                        >
                            {item.volumeInfo.imageLinks?.thumbnail && (
                                <img src={item.volumeInfo.imageLinks.thumbnail} alt="" />
                            )}
                            <div className="resultInfo">
                                <span className="title">{item.volumeInfo.title}</span>
                                <span className="authors">
                                    {item.volumeInfo.authors?.join(", ") || "Unknown"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookSearch;
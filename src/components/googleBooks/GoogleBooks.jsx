import { useQuery } from "@tanstack/react-query";

const GoogleBooks = () => {
    const { data: books, isLoading } = useQuery({
        queryKey: ["googleBooks"],
        queryFn: async () => {
            const res = await fetch(
                "https://www.googleapis.com/books/v1/volumes?q=subject:literary+fiction&orderBy=relevance&maxResults=5&langRestrict=en"
            );
            const data = await res.json();
            return data.items.map((item) => ({
                id: item.id,
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors?.join(", ") || "Unknown",
                thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
                infoLink: item.volumeInfo.infoLink,
            }));
        },
        staleTime: 1000 * 60 * 60,
    });

    if (isLoading) return <p style={{ fontSize: "13px", color: "gray" }}>Loading...</p>;
    if (!books) return null;

    return (
        <div className="googleBooks">
            {books.map((book) => {
                return (
                    <div key={book.id} className="googleBook" onClick={() => window.open(book.infoLink, "_blank")}>
                        {book.thumbnail && (
                            <img src={book.thumbnail} alt={book.title} />
                        )}
                        <div className="googleBookInfo">
                            <span className="googleBookTitle">{book.title}</span>
                            <span className="googleBookAuthors">{book.authors}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GoogleBooks;
import "./share.scss";
import Image from "../../assets/img.png"; 
import Map from "../../assets/map.png"; 
import Friend from "../../assets/friend.png"; 
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "../../supabaseClient";
import BookSearch from "../bookSearch/BookSearch";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [pageRef, setPageRef] = useState("");

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const uploadFile = async (file) => {
    if (!file) return null;

    const fileName = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('bookInAFrameStorage')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw new Error(uploadError.message);
    
    const { data: publicUrlData } = supabase.storage
      .from('bookInAFrameStorage')
      .getPublicUrl(fileName);
      
    if (!publicUrlData || publicUrlData.error) {
        throw new Error("Failed to get public URL after upload.");
    }
    
    return publicUrlData.publicUrl;
  };

  const postMutation = useMutation({
    mutationFn: async ({ book, postData }) => {
      const { data: book_id, error: bookError } = await supabase.rpc('get_or_create_book', {
        p_title: book.title,
        p_authors: book.authors,
        p_thumbnail_url: book.thumbnail_url,
        p_google_books_id: book.google_books_id,
      });

      if (bookError) throw new Error("Failed to find or create book: " + bookError.message);

      const newPost = { ...postData, book_id };
      const { error: postError } = await supabase.from("posts").insert([newPost]);
      if (postError) throw new Error(postError.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setSelectedBook(null);
      setPageRef("");
      setDesc("");
      setFile(null);
    },
    onError: () => {
      alert("An error occurred while sharing your post. Please try again.");      
    }
  });

  const handleClick = async (e) => {
    e.preventDefault();
    
    if (!file || !selectedBook) {
      alert("Please upload an image and select a book.");
      return; 
    }

    let imageUrl = "";
    try {
      imageUrl = await uploadFile(file);
      const postData = {
        caption: desc || null,
        image_url: imageUrl,
        user_id: currentUser.id,
        page_reference: pageRef || null,
      };
      postMutation.mutate({ book: selectedBook, postData });
    } catch (err) {
      alert("Failed to upload image: " + err.message);
      return;
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img 
              src={currentUser?.avatar_url || 'default_placeholder_image_url'} 
              alt="" 
            />
            <input 
              type="text" 
              placeholder="Add your thoughts or a full quote here..." 
              onChange={(e) => setDesc(e.target.value)} 
              value={desc}
              maxLength={500}
            />
          </div>
          <div className="right">
            {file && <img className="file" alt="Preview" src={URL.createObjectURL(file)}/>}
          </div>
        </div>
        <hr />
        <div className="book-details-inputs">
            <h3>Book Details</h3>
            {selectedBook ? (
                <div className="selectedBook">
                    {selectedBook.thumbnail_url && (
                        <img src={selectedBook.thumbnail_url} alt="" />
                    )}
                    <div className="selectedBookInfo">
                        <span className="title">{selectedBook.title}</span>
                        <span className="authors">{selectedBook.authors.join(", ")}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedBook(null)}>
                        Change book
                    </button>
                </div>
            ) : (
                <BookSearch onSelectBook={setSelectedBook} />
            )}
            <input 
                type="text" 
                placeholder="Page Reference (e.g., Page 42)" 
                onChange={(e) => setPageRef(e.target.value)} 
                value={pageRef}
                maxLength={40}
            />
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} onChange={e => setFile(e.target.files[0])}/>
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>{file ? "Change Image" : "Add Image"}</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick} disabled={postMutation.isPending || !selectedBook || !file}>
              {postMutation.isPending ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
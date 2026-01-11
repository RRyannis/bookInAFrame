import "./share.scss";
// NOTE: Map and Friend are now imported correctly for use in <img> tags
import Image from "../../assets/img.png"; 
import Map from "../../assets/map.png"; 
import Friend from "../../assets/friend.png"; 
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "../../supabaseClient";

const Share = () => {

  // Existing State
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  // NEW STATE for Book Data
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState(""); // Will be converted to an array before RPC
  const [pageRef, setPageRef] = useState("");

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ------------------------------------------------
  // 1. SUPABASE STORAGE UPLOAD FUNCTION
  // ------------------------------------------------
  const uploadFile = async (file) => {
    if (!file) return null;

    const fileName = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('bookInAFrameStorage')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", uploadError);
      throw new Error(uploadError.message);
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('bookInAFrameStorage')
      .getPublicUrl(fileName);
      
    if (!publicUrlData || publicUrlData.error) {
        throw new Error("Failed to get public URL after upload.");
    }
    
    return publicUrlData.publicUrl;
  };

  // ------------------------------------------------
  // 2. MUTATION FUNCTION (Handles Book Upsert & Post Insert)
  // ------------------------------------------------
  const postMutation = useMutation({
    mutationFn: async ({ title, authors, postData }) => {
      
      // --- STEP A: Get/Create Book ID (RPC Call) ---
      // Convert authors string (e.g., "Author 1, Author 2") to a clean array
      const authorArray = authors.split(',').map(a => a.trim()).filter(a => a.length > 0);
      
      const { data: book_id, error: bookError } = await supabase.rpc('get_or_create_book', {
        p_title: title,
        p_authors: authorArray,
      });

      if (bookError) {
        console.error("Supabase RPC Error (get_or_create_book):", bookError);
        throw new Error("Failed to find or create book: " + bookError.message);
      }

      // --- STEP B: Insert the Post using the retrieved book_id ---
      const newPost = {
        ...postData,
        book_id: book_id, // Use the ID returned from the RPC function
      };

      const { error: postError } = await supabase.from("posts").insert([newPost]);

      if (postError) {
        console.error("Supabase Post Insert Error:", postError);
        throw new Error(postError.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
});

  // ------------------------------------------------
  // 3. HANDLER FUNCTION
  // ------------------------------------------------
  const handleClick = async (e) => {
    e.preventDefault();
    
    // Check for minimum required data: must have a file AND a title
    if (!file || !title.trim()) {
      alert("Please upload an image and provide the book title.");
      return; 
    }

    let imageUrl = "";
    try {
      // 1. Upload the image file first
      imageUrl = await uploadFile(file);
    } catch (err) {
      console.error("Upload failed, cancelling post:", err);
      return; 
    }
    
    // 2. Define the data structure for the post (excluding book info)
    const postData = {
      caption: desc || null,
      image_url: imageUrl,
      user_id: currentUser.id,
      page_reference: pageRef || null,
      // book_id will be added by the mutation function
    };
    
    // 3. Call the mutation to handle Book Upsert & Post Insert
    postMutation.mutate({ 
      title: title.trim(), 
      authors: authors.trim(), 
      postData 
    });
    
    // 4. Clear form state
    setTitle("");
    setAuthors("");
    setPageRef("");
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        {/* TOP SECTION: User Info, Caption Input, Image Preview */}
        <div className="top">
          <div className="left">
            <img 
              src={currentUser?.avatar_url || 'default_placeholder_image_url'} 
              alt="" 
            />
            {/* Main Caption Input */}
            <input 
              type="text" 
              placeholder="Add your thoughts or a full quote here..." 
              onChange={(e) => setDesc(e.target.value)} 
              value={desc}
            />
          </div>
          <div className="right">
            {file && <img className="file" alt="Preview" src={URL.createObjectURL(file)}/>}
          </div>
        </div>
        <hr />
        
        {/* NEW INPUTS SECTION: Book Details */}
        <div className="book-details-inputs">
            <h3>Book Details</h3>
            <input 
                type="text" 
                placeholder="* Book Title (Required)" 
                onChange={(e) => setTitle(e.target.value)} 
                value={title}
            />
            <input 
                type="text" 
                placeholder="Author(s) (separate with commas, e.g., A. Smith, J. Doe)" 
                onChange={(e) => setAuthors(e.target.value)} 
                value={authors}
            />
            <input 
                type="text" 
                placeholder="Page Reference (e.g., Page 42)" 
                onChange={(e) => setPageRef(e.target.value)} 
                value={pageRef}
            />
        </div>
        <hr />

        {/* BOTTOM SECTION: Buttons and Share */}
        <div className="bottom">
          <div className="left">
            {/* Image Upload Button */}
            <input type="file" id="file" style={{display:"none"}} onChange={e => setFile(e.target.files[0])}/>
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>{file ? "Change Image" : "Add Image"}</span>
              </div>
            </label>
            
            {/* CORRECTION: Placeholder Items now correctly use <img> tag */}
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
            <button onClick={handleClick} disabled={postMutation.isPending || !title.trim() || !file}>
              {postMutation.isPending ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
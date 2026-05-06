import "./RightBar.scss";
import { supabase } from "../../supabaseClient";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useFollow } from "../../hooks/useFollow";
import GoogleBooks from "../googleBooks/GoogleBooks";


// This component handles the hook for each individual user
const SuggestionUser = ({ user }) => {
  const { toggleFollow, isPending } = useFollow(user.id, false);

  return (
    <div className="user">
      <div className="userInfo">
        <img src={user.avatar_url || "/default-avatar.png"} alt="" />
        <span>{user.full_name || user.username}</span>
      </div>
      <div className="buttons">
        <button onClick={() => toggleFollow()} disabled={isPending}>
          {isPending ? "following..." : "follow"}
        </button>
        <button>dismiss</button>
      </div>
    </div>
  );
};
//component to handle the popular books section
const PopBook = ({ book }) => {
  return (
    <div className="book">
      <div className="bookInfo">
        <img src={book.thumbnail_url || "/default-book-cover.png"} alt="" />
        <span>{book.title} </span>
        <span>{book.authors?.join(", ")}</span>
      </div>
    </div>
  );
};

const RightBar = () =>{
    const { currentUser } = useContext(AuthContext);


    const { data: followingData } = useQuery({
        queryKey: ["following", currentUser.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("relationships")
                .select("followedUserId")
                .eq("followerUserId", currentUser.id)
            if (error) throw new Error(error.message);
            return data;
        }
    });

    const followingIds = followingData?.map(r => r.followedUserId) || [];
    const excludeIds = [...followingIds, currentUser.id];

    const { data: notFollowingData, isLoading: isLoadingNotFollowing } = useQuery({
        queryKey: ["profiles", excludeIds],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .not("id", "in", `(${excludeIds.join(",")})`)
                .limit(5)
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!followingData
    });

    const { data: popularBooksData, isLoading: isLoadingPopularBooks } = useQuery({
        queryKey: ["popularBooks"],
        queryFn: async () => { 
          const { data, error } = await supabase
            .from("popular_books")
            .select("*")
          if (error) throw new Error(error.message);
            return data;
        }
      });
   

    return (
      <div className="rightBar">
        <div className="container">
          <div className="item">
            <span>Suggestions for you</span>
            {isLoadingNotFollowing
              ? "Loading suggestions..."
              : notFollowingData?.map((user) => (
                  <SuggestionUser key={user.id} user={user} />
                ))}
          </div>
          {/* <div className="item">
            <span>Popular Books</span>
            {isLoadingPopularBooks 
              ? "Loading..." 
              : popularBooksData?.map((book) => (
                <PopBook book={book} key={book.id} />
            ))}
          </div> */}
          <div className="item">
            <span>Discover Books</span>
            <GoogleBooks />
        </div>
        </div>
      </div>
    );
}

export default RightBar;
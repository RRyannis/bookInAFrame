import "./rightBar.scss";
import { supabase } from "../../supabaseClient";
import { useQuery } from '@tanstack/react-query';
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useFollow } from "../../hooks/useFollow";
import GoogleBooks from "../googleBooks/GoogleBooks";

const SuggestionUser = ({ user, onDismiss }) => {
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
        <button onClick={() => onDismiss(user.id)}>dismiss</button>
      </div>
    </div>
  );
};

const RightBar = () => {
    const { currentUser } = useContext(AuthContext);
    const [dismissedIds, setDismissedIds] = useState([]);

    const handleDismiss = (userId) => {
        setDismissedIds((prev) => [...prev, userId]);
    };

    const { data: followingData } = useQuery({
        queryKey: ["following", currentUser.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("relationships")
                .select("followedUserId")
                .eq("followerUserId", currentUser.id);
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
                .limit(5);
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!followingData
    });

    return (
        <div className="rightBar">
            <div className="container">
                <div className="item">
                    <span>Suggestions for you</span>
                    {isLoadingNotFollowing
                        ? "Loading suggestions..."
                        : notFollowingData
                            ?.filter((user) => !dismissedIds.includes(user.id))
                            .map((user) => (
                                <SuggestionUser key={user.id} user={user} onDismiss={handleDismiss} />
                            ))
                    }
                </div>
                <div className="item">
                    <span>Discover Books</span>
                    <GoogleBooks />
                </div>
            </div>
        </div>
    );
};

export default RightBar;
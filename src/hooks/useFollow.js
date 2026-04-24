import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { supabase } from "../supabaseClient";

export const useFollow = (targetUserId, isFollowing) => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("You must be logged in to follow users.");

      if (isFollowing) {
        // Unfollow logic
        const { error } = await supabase
          .from("relationships")
          .delete()
          .eq("followerUserId", currentUser.id)
          .eq("followedUserId", targetUserId);
        
        if (error) throw new Error(error.message);
      } else {
        // Follow logic
        const { error } = await supabase
          .from("relationships")
          .insert({ 
            followerUserId: currentUser.id, 
            followedUserId: targetUserId 
          });
        
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // 1. Invalidate specific relationship state (Profile Page)
      queryClient.invalidateQueries({ queryKey: ["relationship", targetUserId] });
      
      // 2. Invalidate the global 'following' list (Sidebar/Suggestions logic)
      queryClient.invalidateQueries({ queryKey: ["following", currentUser.id] });
    },
  });

  return {
    toggleFollow: mutation.mutate,
    isPending: mutation.isPending,
  };
};
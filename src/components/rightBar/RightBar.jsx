import "./RightBar.scss";
import { supabase } from "../../supabaseClient";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";

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

    const followingIds = followingData.map(r => r.followedUserId);

    return(
        <div className="rightBar">
            <div className="container">
                <div className="item">
                    <span>Suggestions for you</span>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="" />
                            <span>Jane Doe</span>
                        </div>
                        <div className="buttons">
                            <button>follow</button>
                            <button>dismiss</button>
                        </div>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="" />
                            <span>Jane Doe</span>
                        </div>
                        <div className="buttons">
                            <button>follow</button>
                            <button>dismiss</button>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <span>Latest Activities </span>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="" />
                            <p>
                                <span>Jane Doe</span> Changed their status
                            </p>
                            
                        </div>
                       <span>5 min ago</span>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="" />
                            <p>
                                <span>Jane Doe</span> Changed their profile decoration
                            </p>
                            
                        </div>
                       <span>6 min ago</span>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="" />
                            <p>
                                <span>Jane Doe</span> Changed their work status
                            </p>
                            
                        </div>
                       <span>7 min ago</span>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="" />
                            <p>
                                <span>Jane Doe</span> Changed their relationship status
                            </p>
                            
                        </div>
                       <span>8 min ago</span>
                    </div>

                </div>
                <div className="item">
                    <span>Online Friends</span>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="" />
                            <div className="online" />
                            <span>Jane Doe</span> 
                        </div>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="" />
                            <div className="online" />
                            <span>Jane Doe</span> 
                        </div>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="" />
                            <div className="online" />
                            <span>Jane Doe</span> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightBar;
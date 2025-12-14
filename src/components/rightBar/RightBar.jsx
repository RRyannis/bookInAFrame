import "./RightBar.scss";

const RightBar = () =>{
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
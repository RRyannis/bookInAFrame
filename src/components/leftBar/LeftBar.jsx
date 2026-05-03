import "./leftBar.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

const LeftBar = () => {
    const { currentUser } = useContext(AuthContext);

    return (
        <div className="leftBar">
            <div className="container">
                <Link to={`/profiles/${currentUser?.username}`} style={{ textDecoration: "none" }}>
                    <div className="user">
                        <img
                            src={currentUser?.avatar_url || "/default-avatar.png"}
                            alt=""
                        />
                        <span>{currentUser?.full_name || currentUser?.username}</span>
                    </div>
                </Link>
                <hr />
                <div className="menu">
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <div className="item">
                            <HomeOutlinedIcon />
                            <span>Home</span>
                        </div>
                    </Link>
                    <Link to="/explore" style={{ textDecoration: "none" }}>
                        <div className="item">
                            <ExploreOutlinedIcon />
                            <span>Explore</span>
                        </div>
                    </Link>
                    <Link to={`/profiles/${currentUser?.username}`} style={{ textDecoration: "none" }}>
                        <div className="item">
                            <PersonOutlineOutlinedIcon />
                            <span>Profile</span>
                        </div>
                    </Link>
                    <Link to="/bookmarks" style={{ textDecoration: "none" }}>
                        <div className="item">
                            <BookmarkBorderOutlinedIcon />
                            <span>Bookmarks</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LeftBar;
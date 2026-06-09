import "./navBar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import AppsIcon from "@mui/icons-material/Apps";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext.jsx";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext.jsx";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
    }
  };
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>BookInAFrame</span>
        </Link>
        <HomeOutlinedIcon strokeWidth={1} />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="navbar_search">
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            autoComplete="off"
            
          />
        </div>
      </div>
      <div className="right">
        <PersonOutlineOutlinedIcon
          sx={{ fontSize: 22, "& path": { strokeWidth: 0.2 } }}
        />
        <EmailOutlinedIcon
          sx={{ fontSize: 22, "& path": { strokeWidth: 0.2 } }}
        />
        <NotificationsOutlinedIcon
          sx={{ fontSize: 22, "& path": { strokeWidth: 0.2 } }}
        />
        <div className="user">
          <img
            src={currentUser?.avatar_url || "default_placeholder_image_url"}
            alt=""
          />
          <span>{currentUser?.full_name || currentUser?.username}</span>
        </div>
        <LogOut onClick={handleLogout} className="logout-icon" title="Logout" />
      </div>
    </div>
  );
};

export default Navbar;

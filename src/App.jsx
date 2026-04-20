import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftbar/Leftbar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "../src/styles/style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";

const Layout = () => {
  const { darkMode } = useContext(DarkModeContext);
  
  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <LeftBar />
        <div style={{ flex: 6 }}>
          <Outlet />
        </div>
        <RightBar />
      </div>
    </div>
  );
}

const ProtectedRoute = ({children}) => {
  const { currentUser, loading } = useContext(AuthContext); 
  
  if (loading) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Loading Session...</div>; 
  }
  
  if (!currentUser){
    return <Navigate to="/login" /> ;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
            path="/" 
            element={<ProtectedRoute><Layout /></ProtectedRoute>}
        >
          <Route index element={<Home />} />
          <Route path="profiles/:username" element={<Profile />} />
        </Route>
        
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
      </Routes>
    </BrowserRouter>
  )
}


export default App;
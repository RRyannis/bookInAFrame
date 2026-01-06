import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';

const Login = () => {
    // FIX: State only needs email and password for Supabase login
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const [err, setErr] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Login attempt with:", inputs);
        try {
            await login(inputs);
            console.log("Login successful, navigating...");
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            setErr(error.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className='login'>
            <div className="card">
                <div className="left">
                    <h1>Hello World.</h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <span>Don't you have an account?</span>
                    <Link to="/register">
                        <button>Register</button>
                    </Link>
                </div>
                <div className="right">
                    <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        {/* FIX: Input changed to email */}
                        <input type="email" placeholder='Email' name="email" onChange={handleChange} required/>
                        <input type="password" placeholder='Password' name="password" onChange={handleChange} required/>
                        {err && <div style={{ color: "red" }}>{err}</div>}
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
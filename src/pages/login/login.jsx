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
        try {
            await login(inputs);
            navigate("/");
        } catch (error) {
            // FIX: Access the error message directly from the thrown error object
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
                    <form>
                        {/* FIX: Input changed to email */}
                        <input type="email" placeholder='Email' name="email" onChange={handleChange}/>
                        <input type="password" placeholder='Password' name="password" onChange={handleChange}/>
                        {err && <div style={{ color: "red" }}>{err}</div>}
                        <button onClick={handleLogin}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
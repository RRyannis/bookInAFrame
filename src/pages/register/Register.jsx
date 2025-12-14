import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import './register.scss';

const Register = () => {

    const [ inputs, setInputs ] = useState({
        username:"",
        email:"",
        password:"",
        name:"",
    });

    const [ err, setErr ] = useState(null);

    const handleChange = (e) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}));
    };
    // console.log(inputs);

    const handleClick = async e => {
        e.preventDefault();

        try{
            await axios.post("http://localhost:8800/api/auth/register", inputs)
        } catch (err) {
            setErr(err.response.data);
            console.log(err)
        }
    };

    return(
        <div className='register'>
            <div className="card">
                <div className="left">
                    <h1>Register</h1>
                    <form>
                        <input type="text" placeholder='Username' name="username" onChange={handleChange}/>
                        <input type="text" placeholder='Email' name="email" onChange={handleChange}/>
                        <input type="password" placeholder='Password' name="password" onChange={handleChange}/>
                        <input type="text" placeholder='Name' name="name" onChange={handleChange}/>
                        {err && err}
                        <button onClick={handleClick}>Register</button>
                    </form>
                </div>
                <div className="right">
                    <h1>BookSocial</h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                         Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    </p>
                    <span>Do you have an account?</span>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                    
                </div>
            </div>
        </div>
    );
};

export default Register;
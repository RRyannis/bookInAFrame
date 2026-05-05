import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './register.scss';
import { supabase } from '../../supabaseClient';
//fix issues

const Register = () => {

    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        name: "",
    });

    const [err, setErr] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        setErr(null);
        setIsPending(true);
        

        const { username, email, password, name } = inputs;

        if (!email || !password || !username || !name) {
            setErr("All fields are required.");
            setIsPending(false);
            return;
        }

        try {
            // --- STEP 1: Create the Auth User with email and password ---
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            console.log(authData)

            if (authError) {
                // Handle auth specific errors (e.g., weak password, user already registered)
                throw authError;
            }

            const newUser = authData.user;
            if (!newUser) {
                // This happens if email confirmation is required and the user is not signed in immediately
                alert("Registration successful. Please check your email to confirm your account.");
                navigate("/login");
                console.log("User created but email confirmation is required.");
                return;
            }

            // --- STEP 2: Insert the Profile Data into the 'profiles' table ---
            // The 'id' links it to the 'auth.users' table
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert([
                {
                    id: newUser.id, 
                    username: username,
                    full_name: name
                }
                ], { onConflict: 'id' });

            if (profileError) {
                // NOTE: If profile insertion fails, you might want to delete the auth user
                // to prevent orphaned accounts. For simplicity, we just log the error here.
                console.error("Profile insertion failed:", profileError);
                throw profileError;
            }

            // If successful, navigate to login or home
            navigate("/login");

        } catch (error) {
            // FIX: Access error message directly from the Supabase error object
            setErr(error.message || "Registration failed. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className='register'>
            <div className="card">
                <div className="left">
                    <h1>Register</h1>
                    <form>
                        <input type="text" placeholder='Username' name="username" onChange={handleChange} disabled={isPending}/>
                        <input type="email" placeholder='Email' name="email" onChange={handleChange} disabled={isPending}/>
                        <input type="password" placeholder='Password' name="password" onChange={handleChange} disabled={isPending}/>
                        <input type="text" placeholder='Full Name' name="name" onChange={handleChange} disabled={isPending}/>
                        {err && <div style={{ color: "red", paddingBottom: "10px" }}>{err}</div>}
                        <button onClick={handleClick} disabled={isPending}>
                            {isPending ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>
                <div className="right">
                    <h1>bookInAFrame</h1>
                    <p>
                        An app to share your favorite book moments and quotes in the form of a "frame". Discover new exciting books and
                        nerd out over your favorite moments in literature!
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
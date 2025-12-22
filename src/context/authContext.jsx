/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
// 1. IMPORT supabase
import { supabase } from "../supabaseClient"; 
// Remove: import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    // 2. State Initialization: currentUser starts null, loading state added
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    // --- HELPER FUNCTION: Fetch Profile Data ---
    // Fetches the user's specific public data (username, avatar_url) from the 'profiles' table
    const getProfile = async (userId) => {
        if (!userId) return null;
        
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, full_name') // Select all required profile fields
            .eq('id', userId)
            .single();

        if (error) {
            console.error("Error fetching user profile:", error);
            // Even if profile fetch fails, we return basic user data
            return { id: userId }; 
        }

        return profile;
    };
    
    // --- 3. LOGIN FUNCTION ---
    const login = async (inputs) => {
        setLoading(true);
        // inputs should contain { email, password }
        const { data, error } = await supabase.auth.signInWithPassword({
            email: inputs.email,
            password: inputs.password,
        });

        if (error) {
            setLoading(false);
            console.error("Supabase Login Error:", error.message);
            throw new Error(error.message);
        }
        
        // After successful login, the onAuthStateChange listener (in useEffect) 
        // will automatically detect the session and fetch the profile.
        setLoading(false);
        return data;
    };

    // --- 4. LOGOUT FUNCTION ---
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Supabase Logout Error:", error.message);
            throw new Error(error.message);
        }
        setCurrentUser(null);
    };

    // --- 5. SESSION LISTENER (Replaces local storage management) ---
    useEffect(() => {
        // This function handles the initial session and subsequent changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session) {
                    // User is logged in
                    const userId = session.user.id;
                    
                    // Fetch profile data and combine with session data
                    const profileData = await getProfile(userId);
                    
                    // Combine Supabase user data and custom profile data
                    const combinedUser = {
                        ...session.user,
                        ...profileData,
                        id: userId, // Ensure ID is used from session/profile
                    };
                    setCurrentUser(combinedUser);
                    
                } else {
                    // User is logged out
                    setCurrentUser(null);
                }
                setLoading(false);
            }
        );

        // Cleanup the subscription when the component unmounts
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // NOTE: Removed local storage management as Supabase handles session persistence

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider> 
    )
};
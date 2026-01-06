/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";

import { supabase } from "../supabaseClient"; 

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    const getProfile = async (userId) => {
        if (!userId) return null;
        
        const { data: profile, error } = await supabase
            .from('profiles').select('id, username, avatar_url, full_name').eq('id', userId).single();

        if (error) {
            console.error("Error fetching user profile:", error);
            return { id: userId }; 
        }

        return profile;
    };
    const login = async (inputs) => {
        setLoading(true);
        console.log("Login function called with:", inputs);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: inputs.email,
            password: inputs.password,
        });

        console.log("Supabase response:", { data, error });

        if (error) {
            setLoading(false);
            console.error("Supabase Login Error:", error.message);
            throw new Error(error.message);
        }

        console.log("Login successful, fetching profile...");
        const userId = data.user.id;
        const profileData = await getProfile(userId);
        console.log("Profile fetched:", profileData);
        
        const combinedUser = {
            ...data.user,
            ...profileData,
            id: userId,
        };
        setCurrentUser(combinedUser);
        setLoading(false);
        
        console.log("Login complete, currentUser set:", combinedUser);
        return data;
    };
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Supabase Logout Error:", error.message);
            throw new Error(error.message);
        }
        setCurrentUser(null);
    };
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log("Auth state changed:", event, session);
                
                if (session) {
                    const userId = session.user.id;
                    const profileData = await getProfile(userId);
                    
                    const combinedUser = {
                        ...session.user,
                        ...profileData,
                        id: userId,
                    };
                    setCurrentUser(combinedUser);
                } else {
                    setCurrentUser(null);
                }
                setLoading(false);
            }
        );
        return () => {
            subscription.unsubscribe();
        };
    }, []);
    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider> 
    )
};
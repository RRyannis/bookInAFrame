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

        if (error) {
            setLoading(false);
            throw new Error(error.message);
        }

        console.log("Login successful, fetching profile...");
        const userId = data.user.id;
        const profileData = await getProfile(userId);
        
        const combinedUser = {
            ...data.user,
            ...profileData,
            id: userId,
        };
        setCurrentUser(combinedUser);
        setLoading(false);
        
        return data;
    };
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
        setCurrentUser(null);
    };
    useEffect(() => {
        let subscription;

        (async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    const keysToRemove = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith("supabase.auth")) keysToRemove.push(key);
                    }
                    keysToRemove.forEach((k) => {
                        localStorage.removeItem(k);
                    });
                }
            } catch (err) {
                throw new Error("Error checking session: " + err.message);
            }

            const { data } = supabase.auth.onAuthStateChange(
                async (event, session) => {
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
            subscription = data?.subscription;
        })();

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, []);
    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider> 
    )
};
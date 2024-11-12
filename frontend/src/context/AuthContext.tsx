"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {AuthContextType, User} from "@/types/auth";
import {useRouter} from "next/navigation";
import axios from "axios";
import {api} from "@/lib/axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * @description Auth provider
 * @param {React.ReactNode} children - React nodes
 * @returns React.FC<{ children: React.ReactNode }>
 * */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Check if user is already authenticated (e.g. user data in session storage)
    useEffect(() => {
        const savedUser = sessionStorage.getItem('auth-user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, [])

    // Check authentication status (ping server to check if user is still authenticated)
    useEffect(() => {
        async function checkAuthStatus() {
            if (user) {
                const response = await api.get('/auth/status');
                if (response.status === 401) {
                    console.warn("You have been logged out due to inactivity");
                    clearStorage();
                } else {
                    setUser({...user, credits: response.data.credits});
                }
            }
        }

        // Initial check on component mount
        checkAuthStatus();

        const authStatusInterval = setInterval(async () => await checkAuthStatus(), 1000 * 60 * 5);

        // Cleanup
        return () => clearInterval(authStatusInterval);
    }, [])

    /**
     * @description Self explanatory
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns Promise<void>
     * */
    const login = async (email: string, password: string) => {
        const response = await api.post('/auth', {username: email, password});
        if (response.status !== 200) {
            console.error("Error logging in");
            return;
        }

        setUser(response.data);
        sessionStorage.setItem('auth-user', JSON.stringify(response.data));
        router.push('/images');
    }

    /**
     * @description Self explanatory
     * @returns Promise<void>
     * */
    const logout = async () => {
        const response = await api.post('/auth/logout');
        if (response.status !== 200) {
            console.error("Error logging out");
        }

        setUser(null);
        sessionStorage.removeItem('auth-user');
        router.push('/');
    }

    /**
     * @description Create new backend call to create new account
     * @param {User} userData - User data
     * @param {string} password - User password
     * @returns Promise<void>
     * */
    const createAccount = async (userData: User, password: string) => {
        const response = await api.post('/users', {...userData, password});
        if (response.status === 201) {
            await login(userData.username, password);
        } else {
            console.error("Error creating account");
        }
    }

    /**
     * @description Create new backend call to update account
     * @param {User} userData - User data
     * @returns Promise<void>
     * */
    const updateAccount = async (userData: User) => {
        const response = await api.put('/auth' + userData._id, userData);
    }

    /**
     * @description Create new backend call to delete account
     * @param {User} userData - User data
     * @returns Promise<void>
     * */
    const deleteAccount = async (userData: User) => {
        const response = await api.delete('/auth' + userData._id);
    }

    /**
     * @description Create new backend call to update password
     * @param {string} newPassword - New password
     * @returns Promise<void>
     * */
    const updatePassword = async (newPassword: string) => {
        const response = await axios.delete('/api/auth/' + newPassword);
    }

    /**
     * @description Update user credits with given amount
     * @param {number} amount - amount to be added to the current user's credit state
     * @returns void
     * */
    const updateUserCredits = (amount: number) => {
        if (!user) return;

        setUser({...user, credits: user.credits + amount});
        sessionStorage.setItem('auth-user', JSON.stringify({...user, credits: user.credits + amount}));
    }

    /**
     * @description Clear session storage and set user to null, useful for logging out on the frontend in case of timeout
     * @returns void
     * */
    const clearStorage = () => {
        setUser(null);
        sessionStorage.clear();
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                createAccount,
                updateAccount,
                deleteAccount,
                updatePassword,
                updateUserCredits,
                clearStorage
            }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * @description Custom hook to use AuthContext
 * @returns AuthContextType
 * */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}
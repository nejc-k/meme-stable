"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {AuthContextType, User} from "@/types/auth";
import {useRouter} from "next/navigation";
import axios from "axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * @description Auth provider
 * @param {React.ReactNode} children - React nodes
 * @returns React.FC<{ children: React.ReactNode }>
 * */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    // Check if user is already authenticated (e.g. token in session storage)
    useEffect(() => {
        const savedToken = sessionStorage.getItem('auth-token');
        const savedUser = sessionStorage.getItem('auth-user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, [])

    /**
     * @description Self explanatory
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns Promise<void>
     * */
    const login = async (email: string, password: string) => {
        console.log("Logging in with email:", email, "and password:", password);

        // TODO: Uncomment before production
        // const response = await axios.post('/api/auth/login', {email, password});
        // const {token, userData} = response.data;

        const token = "fake-token";
        const userData = {
            id: "1",
            name: "John",
            lastname: "Doe",
            username: "fake-username",
            email: "john.doe@email.com",
            tokens: 10
        }

        setToken(token);
        setUser(userData);
        sessionStorage.setItem('auth-token', token);
        sessionStorage.setItem('auth-user', JSON.stringify(userData));

        // TODO: Remove before production
        if (process.env.NODE_ENV === "development") {
            document.cookie = `auth-token=${token}; expires=7; sameSite=Strict`;
            console.log("Created cookie with token:", token);
        }

        router.push('/images');
    }

    /**
     * @description Self explanatory
     * @returns Promise<void>
     * */
    const logout = async () => {
        // TODO: Uncomment before production
        if (process.env.NODE_ENV === "production") {
            const response = await axios.post('/api/auth/logout');
        }

        setToken(null);
        setUser(null);
        sessionStorage.removeItem('auth-token');
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
        // TODO: Uncomment before production
        if (process.env.NODE_ENV === "production") {
            const response = await axios.post('/api/auth/register', {...userData, password});
            if (response.status === 201) {
                await login(userData.email, password);
            }
            return;

        } else {
            await login(userData.email, password);
        }
    }

    /**
     * @description Create new backend call to update account
     * @param {User} userData - User data
     * @returns Promise<void>
     * */
    const updateAccount = async (userData: User) => {
        const response = await axios.put('/api/auth/' + userData.id, userData);
    }

    /**
     * @description Create new backend call to delete account
     * @param {User} userData - User data
     * @returns Promise<void>
     * */
    const deleteAccount = async (userData: User) => {
        const response = await axios.delete('/api/auth/' + userData.id);
    }

    /**
     * @description Create new backend call to update password
     * @param {string} newPassword - New password
     * @returns Promise<void>
     * */
    const updatePassword = async (newPassword: string) => {
        const response = await axios.delete('/api/auth/' + newPassword);
    }

    return (
        <AuthContext.Provider
            value={{user, token, login, logout, createAccount, updateAccount, deleteAccount, updatePassword}}>
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
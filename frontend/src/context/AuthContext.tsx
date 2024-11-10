"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {AuthContextType, User} from "@/types/auth";
import {useRouter} from "next/navigation";

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
     * @param {string} token - Auth token
     * @param {User} userData - User data
     * @returns void
     * */
    const login = (token: string, userData: User) => {
        setToken(token);
        setUser(userData);
        sessionStorage.setItem('auth-token', token);
        sessionStorage.setItem('auth-user', JSON.stringify(userData));
        router.push('/images');
    }

    /**
     * @description Self explanatory
     * @returns void
     * */
    const logout = () => {
        setToken(null);
        setUser(null);
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('auth-user');
        router.push('/');
    }

    /**
     * @description Create new backend call to create new account
     * @param {User} userData - User data
     * @returns void
     * */
    const createAccount = (userData: User) => {

    }

    /**
     * @description Create new backend call to update account
     * @param {User} userData - User data
     * @returns void
     * */
    const updateAccount = (userData: User) => {

    }

    /**
     * @description Create new backend call to delete account
     * @param {User} userData - User data
     * @returns void
     * */
    const deleteAccount = (userData: User) => {

    }

    return (
        <AuthContext.Provider value={{user, token, login, logout, createAccount, updateAccount, deleteAccount}}>
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
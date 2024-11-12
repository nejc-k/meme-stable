/**
 * @description Auth context type.
 * */
export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createAccount: (userData: User, password: string) => Promise<void>;
    updateAccount: (userData: User) => Promise<void>;
    deleteAccount: (userData: User) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    updateUserCredits: (amount: number) => void;
    clearStorage: () => void;
}

/**
 * @description User object type.
 * */
export interface User {
    _id: string;
    name: string;
    lastname: string;
    username: string;
    email: string;
    credits: number;
}
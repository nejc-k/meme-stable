export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    createAccount: (userData: User) => void;
    updateAccount: (userData: User) => void;
    deleteAccount: (userData: User) => void;
}

export interface User {
    id: string;
    name: string;
    lastname: string;
    username: string;
    email: string;
}
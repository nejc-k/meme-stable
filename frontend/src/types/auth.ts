export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createAccount: (userData: User, password: string) => Promise<void>;
    updateAccount: (userData: User) => Promise<void>;
    deleteAccount: (userData: User) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
}

export interface User {
    id: string;
    name: string;
    lastname: string;
    username: string;
    email: string;
    tokens: number;
}
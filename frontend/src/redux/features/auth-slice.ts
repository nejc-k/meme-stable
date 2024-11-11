import {createSlice, PayloadAction} from "@reduxjs/toolkit"

type InitialState = {
    value:AuthState;
}

type AuthState = {
    isAuth: boolean;
    username:string;
    userId:string;
}

const initialState = {
    value: {
        isAuth:false,
        userId:"",
        username:""
    } as AuthState
} as InitialState

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logOut:()=>{
            return initialState;
        },
        logIn:(_, action:PayloadAction<{userId:string, username:string}>)=>{
           console.log(action.payload.userId) 
           console.log(action.payload.username) 
            return {value:{isAuth:true,  userId:action.payload.userId, username:action.payload.username}}
        }

    }
})


export const {logIn, logOut} = auth.actions
export default auth.reducer
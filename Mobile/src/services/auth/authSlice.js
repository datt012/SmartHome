import {combineReducers, createSlice, PayloadAction} from '@reduxjs/toolkit'



const authSlice = createSlice({
    name: 'test',
    initialState: { token: null ,role:null,isLogin:false},
    reducers: {
        setCredentials: (state, data) => {
            state.token = data.payload.id_token;
            state.isLogin = true;
        },
        logOut:(state) =>{
            state.token =  null;
            state.isLogin = false;
        }
    },
});
export const { setCredentials,logOut } = authSlice.actions

export default authSlice.reducer

import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
    name:'user',
    initialState:{token:null,isAuthenticated:false,data:{}},
    reducers:{
        setToken:(state,action)=>{
            state.token = action.payload
        },
        setIsAuthenticated:(state,action) =>{
            state.isAuthenticated = action.payload
        },
        setUser:(state,action) =>{
             state.data = action.payload
        },
        editUserName:(state,action)=>{
            state.data = {...state.data,...action.payload}
        }



    }
})
export const userAction = userSlice.actions
export default userSlice.reducer
import {createSlice} from '@reduxjs/toolkit'

const isLoadingSlice = createSlice({
    name:'isLoading',
    initialState:{isLoading:false},
    reducers:{
        setIsLoading:(state,action)=>{
            state.isLoading =action.payload
        },


    }
})
export const isLoadingAction = isLoadingSlice.actions
export default isLoadingSlice.reducer
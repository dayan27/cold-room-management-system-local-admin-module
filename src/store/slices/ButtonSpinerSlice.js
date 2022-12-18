import {createSlice} from '@reduxjs/toolkit'

const buttonSpiner = createSlice({
    name:'isLoadingbuton',
    initialState:{isLoading:false},
    reducers:{
        setBtnSpiner:(state,action)=>{
           state.isLoading = action.payload
        },


    }
})
export const buttonAction = buttonSpiner.actions
export default buttonSpiner.reducer
import {createSlice} from '@reduxjs/toolkit'

const revenueSlice = createSlice({
    name:'revenue',
    initialState:{revenues:[]},
    reducers:{
        setRevenues(state,action){
            state.revenues = action.payload
        },


    }
})
export const revenueAction = revenueSlice.actions
export default revenueSlice.reducer
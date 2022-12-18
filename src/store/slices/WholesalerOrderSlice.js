import {createSlice} from '@reduxjs/toolkit'

const whOrderHrySlice = createSlice({
    name:'whOrHi',
    initialState:{orders:[]},
    reducers:{
        setWhOrders(state,action){
            state.orders = action.payload
        },


    }
})
export const whOrAction = whOrderHrySlice.actions
export default whOrderHrySlice.reducer
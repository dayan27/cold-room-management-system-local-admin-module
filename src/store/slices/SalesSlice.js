import {createSlice} from '@reduxjs/toolkit'

const salesSlice = createSlice({
    name:'sales',
    initialState:{saleses:[]},
    reducers:{
        setSales(state,action){
            state.saleses = action.payload
        },


    }
})
export const salesAction = salesSlice.actions
export default salesSlice.reducer
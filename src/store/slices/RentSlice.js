import {createSlice} from '@reduxjs/toolkit'

const rentSlice = createSlice({
    name:'rent',
    initialState:{rents:[]},
    reducers:{
        setRents(state,action){
            state.rents = action.payload
        },
        


    }
})
export const rentAction = rentSlice.actions
export default rentSlice.reducer
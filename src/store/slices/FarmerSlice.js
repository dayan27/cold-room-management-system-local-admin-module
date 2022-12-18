import {createSlice} from '@reduxjs/toolkit'

const farmerSlice = createSlice({
    name:'farmers',
    initialState:{farmers:[]},
    reducers:{
        setFarmers(state,action){
            state.farmers = action.payload
        },
        editFarmer:(state,action)=>{
            const index = state.farmers.findIndex(farmer=>farmer.id*1===action.payload.id*1)
            state.farmers[index] = action.payload
        }


    }
})
export const farmerAction = farmerSlice.actions
export default farmerSlice.reducer
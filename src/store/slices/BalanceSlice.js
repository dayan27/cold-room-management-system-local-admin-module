import {createSlice} from '@reduxjs/toolkit'

const balanceSlice = createSlice({
    name:'balance',
    initialState:{balances:[]},
    reducers:{
        setBalances(state,action){
            state.balances = action.payload
        },
        withdrawMoney:(state,action)=>{
            const balanceHistory = []
            state.balances.farmerBalances.forEach(balance => {
                if(balance.orderCode*1 === action.payload*1){
                    balanceHistory.push({...balance,state:1})
                }
                else {
                    balanceHistory.push({...balance})
                }
            });
           state.balances.farmerBalances = balanceHistory
        }


    }
})
export const balanceAction = balanceSlice.actions
export default balanceSlice.reducer
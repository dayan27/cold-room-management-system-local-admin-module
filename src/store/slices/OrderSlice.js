import {createSlice} from '@reduxjs/toolkit'

const orderSlice = createSlice({
    name:'coldroomList',
    initialState:{orders:[],orderItems:[]},
    reducers:{
        setOrders:(state,action)=>{
            state.orders = action.payload
        },
        setOrderItems:(state,action)=>{
          state.orderItems = action.payload  
        },
        setOrderStatus:(state,action)=>{
            const index = state.orders.data_name.findIndex(order=>order.id*1===action.payload.id*1)
            state.orders.data_name[index].orderStatus= action.payload.status
        },
        setPaymentStatus:(state,action)=>{
            const index = state.orders.data_name.findIndex(order=>order.id*1===action.payload.id*1)
            state.orders.data_name[index].paymentStatus= action.payload.status
        }


    }
})
export const orderAction = orderSlice.actions
export default orderSlice.reducer
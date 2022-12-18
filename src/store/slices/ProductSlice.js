import {createSlice} from '@reduxjs/toolkit'

const productSlice = createSlice({
    name:'product',
    initialState:{products:[],productHistries:[],},
    reducers:{
        setProducts:(state,action)=>{
            state.products = action.payload
        },
        addProduct:(state,action)=>{
            state.products.push(action.payload)
        },
        setProductHistory:(state,action)=>{
            state.productHistries = action.payload
        },
        // editFarmerProduct:(stae,action)=>{

        // },
        deleteHistory:(state,action)=>{
            const index  = state.productHistries.data_name.findIndex(product=>product.id === action.payload)
            state.productHistries.data_name.splice(index,1)
        }
        

    }
})
export const productAction = productSlice.actions
export default productSlice.reducer
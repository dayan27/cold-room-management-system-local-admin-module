import { configureStore } from "@reduxjs/toolkit";
import IsLoadingReducer from './slices/spinerSlice'
import BtnSpinerReducer from "./slices/ButtonSpinerSlice";
import ProductReducer from "./slices/ProductSlice";
import OrderReducer from "./slices/OrderSlice";
import FarmerReducer from "./slices/FarmerSlice";
import WholesalerReducer from "./slices/WholesalerSlice";
import RevenueReducer from "./slices/RevenueSlice";
import SalesReducer from "./slices/SalesSlice";
import UserReducer from "./slices/UserSlice";
import RentReducer from "./slices/RentSlice";
import BalanceReducer from "./slices/BalanceSlice";
import WhOrHiReducer from "./slices/WholesalerOrderSlice";
import NotificationReducer from "./slices/NotificationSlice";

 


const store = configureStore({
    reducer:{
        loading:IsLoadingReducer,
        btn:BtnSpinerReducer,
        product:ProductReducer,
        order:OrderReducer,
        farmer:FarmerReducer,
        wholesaler:WholesalerReducer,
        revenue:RevenueReducer,
        sales:SalesReducer,
        user:UserReducer,
        rent:RentReducer,
        balance:BalanceReducer,
        wholesalerOrder:WhOrHiReducer,
        notification:NotificationReducer,

        
    }
})
 
export default store
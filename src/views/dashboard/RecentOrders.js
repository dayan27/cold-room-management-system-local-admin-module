import { useState,useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import {Link} from 'react-router-dom'
import { isLoadingAction } from "../../store/slices/spinerSlice";
import { useDispatch,useSelector} from "react-redux";
import apiClient from '../../url/index';
import classes from './RecentOrders.module.css'
const RecentOrders = () =>{
  const [recentOrders,setRecentOrders] = useState([])
  const user = useSelector(state=>state.user.data)
  const dispatch = useDispatch()
  const  featchOrders = async () =>{   
      
    dispatch(isLoadingAction.setIsLoading(false))
  try{
   var response = await apiClient.get(`localadmin/orders?coldRoomId=${user.coldRoom.id}`)
   if(response.status === 200){
    const orders = response.data?.data_name.slice(0,8)
    setRecentOrders(orders)
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
}
useEffect(()=>{
  featchOrders()
// eslint-disable-next-line react-hooks/exhaustive-deps
},[user])
  return (
    <div>
        <div className='d-flex justify-content-between text-white px-4 pb-4'>
            <div className='fw-bold fs-5'>Recent Orders</div>
            <div>
           <Link to={'/orders'} className={`${classes.yellowText} text-decoration-none fw-bold fs-5`}>See All</Link>
            </div>
        </div>
        {
        recentOrders?.length && (
      <Table responsive="md" borderless className='text-white'>
        <thead className={classes.header}>
          <tr>
            <th>Order ID</th>
            <th>Wholesaler</th>
            <th>Ordered Date(GC)</th>
            <th>Cold Room</th>
            <th>Price(ETB)</th>
            <th>Order Status</th>
            <th>Payment Status</th>
          </tr>
        </thead>        
          <tbody>
          {
            recentOrders.map((order) =>(
              <tr className={classes.row} key={order.id}>
              <td className="p-3">{order.code}</td>
              <td className="p-3">{order.coldRoom.name}</td>
              <td className="p-3">{order.wholeSaler?.fName+' '+order.wholeSaler?.lName}</td>
              <td className="p-3">{order.createdAt.slice(0,10)}</td>
              <td className="p-3">{order.totalPrice}</td>
              <td className="p-3 text-center">{order.orderStatus}</td>
              <td className="p-3 text-center">{order.paymentStatus}</td>
            </tr>
            ))
          }
          </tbody>
      </Table>
      )
    }

    </div>
  );
}

export default RecentOrders;
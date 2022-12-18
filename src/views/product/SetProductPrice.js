import { Fragment,useEffect,useRef } from "react";
import { useSelector,useDispatch } from "react-redux";
import { orderAction } from "../../store/slices/OrderSlice";
import { isLoadingAction } from "../../store/slices/spinerSlice";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button"
import ReactToPrint from "react-to-print";
import apiClient from "../../url/index";
import {useNavigate,useParams } from "react-router-dom";
import classes from "./Products.module.css";



const ProductHistory = () => {
  const dispatch = useDispatch()
  const orders = useSelector(state =>state.order.orderItems)
  const navigate = useNavigate()
  const componentRef = useRef()
  const {orderId} = useParams() 

  async function  featchOrder(){
    dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`admin/orders/${orderId}`)
   if(response.status === 200){
    dispatch(orderAction.setOrderItems(response.data || []))
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
}
  useEffect( ()=>{
    
  featchOrder()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <Fragment>
    <Button onClick={()=>navigate(-1)} variant='none' className={`${classes.boxShadow} fs-3 fw-bold`}><i className="fas fa-arrow-left"></i></Button> 
    <div ref={componentRef}>
      <div className="fw-bold">Order Details</div>
      <div className="d-flex justify-content-between">
      <div>
        <div className="mt-3">
          <span className="fw-bold">Order Id</span>: {orders.orderCode}
        </div>
        <div className="mt-3">
          <span className="fw-bold">Wholesaler</span>: {orders.wholeSaler?.fName+' '+orders.wholeSaler?.lName}
        </div>
      </div>
      <div className="me-5">
        <div className="mt-3">
          <span className="fw-bold">Total Price(ETB)</span>: {orders.totalPrice}
        </div>
        <div className="mt-3">
          <span className="fw-bold">Payment Status</span>: {orders.paymentStatus}
        </div>
      </div>
      <div>
        <div className="mt-3">
          <span className="fw-bold">Paid Amount(ETB)</span>: {orders.paidAmount}
        </div>
        <div className="mt-3">
          <span className="fw-bold">Remaining Amount(ETB)</span>: {orders.totalPrice - orders.paidAmount}
        </div>
      </div>
    </div>
      <div className={`${classes.bottomBorder} mt-5`}></div>
        <div className={`${classes.grayBg} d-flex justify-content-end mt-3 p-2`}>
        <div>
        <ReactToPrint
        trigger={()=><Button variant='none' className="exportbtn onPrintDnone py-1"><span><i className="fas fa-file-export"></i></span> Export</Button>}
        content={()=>componentRef.current}       
        documentTitle='new document'
        pageStyle='print'
        />
        </div>
      </div>
      
      <div className="mt-4">
        <Table responsive="md">
          <thead className={classes.header}>
            <tr>
              <th>Product SKU</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quality</th>
              <th>Quantity(kg)</th>
              <th>Price per Kg(ETB)</th>
              <th>Vat %</th>
              <th>Total Price(ETB)</th>
            </tr>
          </thead>
          <tbody>
          {
            orders.orderItems?.map((order) =>(
              <tr className={classes.row} key={order.id}>
              <td className="p-3">{order.farmerProduct.warehousePosition}</td>
              <td className="p-3">{order.farmerProduct.product?.name}</td>
              <td className="p-3">{order.farmerProduct.productType?.title}</td>
              <td className="p-3">{order.farmerProduct.quality}</td>
              <td className="p-3">{order.quantity}</td>
              <td className="p-3">{order.farmerProduct.pricePerKg}</td>
              <td className="p-3 text-center">null</td>
              <td className="p-3 text-center">{order?.price}</td>
            </tr>
            ))
          }
            
           
          </tbody>
        </Table>
      </div>
      </div>
    </Fragment>
  );
};
export default ProductHistory;

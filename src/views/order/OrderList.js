import { useEffect,useState,useRef } from "react";
import { useSelector,useDispatch } from "react-redux";
import { orderAction } from "../../store/slices/OrderSlice";
import { isLoadingAction } from "../../store/slices/spinerSlice";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import apiClient from "../../url/index";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import OrderStatus from "./OrderStatus";
import PaymentStatus from "./PaymentStatus";
import Pagination from 'react-bootstrap/Pagination';
import classes from "./Orders.module.css";


const OrderList = () => {
  const [isOrderStatusOpen,setIsOrderStatusOpen] = useState(false)
  const [isPayMentStatusOpen,setIsPayMentStatusOpen] = useState(false)
  const [currentPage,setCurrentPage] = useState(1)
  const[order,setOrder] = useState({})
  const dispatch = useDispatch()
  const orders = useSelector(state =>state.order.orders)
  const user = useSelector(state=>state.user.data)
  const componentRef = useRef()
  const searchBy = useRef()
  const navigate = useNavigate()
   
  const  featchOrders = async () =>{
    dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/orders?coldRoomId=${user.coldRoom.id}&search=${searchBy.current.value}&status=${''}&date=${''}&page=${currentPage}`)
   if(response.status === 200){
    dispatch(orderAction.setOrders(response.data || []))
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
}
  useEffect( ()=>{
   
  featchOrders()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentPage,user])
  const handlOrderItem = (orderId) =>{
    navigate(`/orders/${orderId}`)
  }
  const handlOrderStatus = (order) =>{
    setOrder(order)
    setIsOrderStatusOpen(true)
}
const handlOrderModalClose = () =>{
  setIsOrderStatusOpen(false)
}
const handlPaymentStatus = (order) =>{
  setOrder(order)
  setIsPayMentStatusOpen(true)
}
const handlPaymentStatusModalClose = () =>{
  setIsPayMentStatusOpen(false)
}
const searchByhandler= async() =>{
  dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/orders?coldRoomId=${user.coldRoom.id}&search=${searchBy.current.value}&status=${''}&date=${''}&page=${1}`)
   if(response.status === 200){
    dispatch(orderAction.setOrders(response.data || []))
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
  setCurrentPage(1)
}
  const filterOrderHandler = async(e)=>{
    dispatch(isLoadingAction.setIsLoading(false))
    try{
     var response = await apiClient.get(`localadmin/orders?coldRoomId=${user.coldRoom.id}&search=${searchBy.current.value}&status=${e.target.value}&date=${''}`)
     if(response.status === 200){
      dispatch(orderAction.setOrders(response.data || []))
     }
    }
    catch(err){}
    finally {dispatch(isLoadingAction.setIsLoading(false))
    }
}
const enterKeyHandler = (event) =>{
  if(event.key === 'Enter' || !event.target.value){
    searchByhandler()
  }
}
const searchHandler = async() =>{
  searchByhandler()
  }
  const filterByDateHandler = async(e) =>{
    console.log('date=',e.target.value)
    dispatch(isLoadingAction.setIsLoading(false))
  try{
   var response = await apiClient.get(`localadmin/orders?coldRoomId=${user.coldRoom.id}&search=${searchBy.current.value}&status=${''}&date=${e.target.value}`)
   if(response.status === 200){
    dispatch(orderAction.setOrders(response.data || []))
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))
  }
  } 
  const setPage = (nomber) =>{
    setCurrentPage(nomber)
  }
  const setNextPage = () =>{
    setCurrentPage(prevValue=>prevValue+1)
  }
  const setPrevPage = ()=>{
    setCurrentPage(prevValue=>prevValue - 1)
  }
  return (
    <div ref={componentRef}>
      <h5 className="text-bold">Orders List</h5>
      <p className={`${classes.titleP} fw-bold small`}>
        In the Orders section you can view list of orders and manage all orders with
        their detail.You can view and change order status
        and payment status of an order. 
      </p>
      <div className={`${classes.bottomBorder} mt-5`}></div>
        <div className={`${classes.grayBg} d-flex  mt-3 p-2`}>
        <InputGroup className="w-25 border rounded  align-self-center onPrintDnone">
          <InputGroup.Text id="basic-addon1" className={classes.searchIcon}>
            <span onClick={searchHandler}>
              <i className="fas fa-search"></i>
            </span>
          </InputGroup.Text>
          <Form.Control
            className={classes.searchInput}
            placeholder="search orders by wholesaler name"
            ref={searchBy}
            aria-label="Username"
            aria-describedby="basic-addon1"
            onKeyUp={enterKeyHandler}
          />
        </InputGroup>
        <div className="ms-auto me-3 align-self-center onPrintDnone">
        <Form.Select aria-label="Default select example" onChange={filterOrderHandler}>
        <option value=''>All</option>
        <option value="pending">Pending Orders</option>
        <option value="completed">Completed Orders</option>
        <option value="cancelled">Cancelled Orders</option>
        <option value="partiallyPaid">Partially Payed Orders</option>
        <option value="paid">Fully Payed Orders</option>
        <option value="unpaid">Unpaid Orders</option>
      </Form.Select>
        </div>
      <div className="me-3 align-self-center onPrintDnone">
      <Form.Group controlId="exampleForm.ControlInput1">
      <Form.Control
       type="date"
       onChange={filterByDateHandler}
        />
    </Form.Group>
      </div>
        <div className="align-self-center">
        <ReactToPrint
        trigger={()=><Button variant='none' className="exportbtn py-1 onPrintDnone"><span><i className="fas fa-file-export"></i></span> Export</Button>}
        content={()=>componentRef.current}       
        documentTitle='new document'
        pageStyle='print'
        />
        </div>
      </div>
      {
        orders.data_name?.length > 0 && (
      <div className="mt-4">
        <Table responsive="md">
          <thead className={classes.header}>
            <tr>
              <th>Order-Code</th>
              <th>Wholesaler</th>
              <th>Ordered Date</th>
              <th>Total Price</th>
              <th>Order Status</th>
              <th>Payment Status</th>
              <th className=""></th>
            </tr>
          </thead>
          <tbody>
          {
            orders.data_name.map((order) =>(
              <tr className={classes.row} key={order.id}>
              <td className="p-3">{order.orderCode}</td>
              <td className="p-3">{order.wholeSaler?.fName+' '+order.wholeSaler?.lName}</td>
              <td className="p-3">{order.createdAt.slice(0,10)}</td>
              <td className="p-3">{order.totalPrice}</td>
              <td className="p-3 text-center">{order.orderStatus}</td>
              <td className="p-3 text-center">{order.paymentStatus}</td>
            <td className="p-3 onPrintDnone">
              <Dropdown>
      <Dropdown.Toggle variant="none" id="dropdown-basic">
      <i className="fas fa-ellipsis-v"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu className={classes.dropdownBg}>
      <Button
        variant="none"
        className={`${classes.dropdownItem} border-bottom w-100 rounded-0 text-start ps-3`}
        onClick={()=>handlOrderItem(order.id)}>Order Item</Button>
      <Button
        variant="none"
        className={`${classes.dropdownItem} border-bottom w-100 rounded-0 text-start ps-3`}
         onClick={()=>handlOrderStatus(order)}>Order Status</Button>
      <Button
        variant="none"
         className={`${classes.dropdownItem} border-bottom w-100 rounded-0 text-start ps-3`}
          onClick={()=>handlPaymentStatus(order)}>Payment Status</Button>
        </Dropdown.Menu>
    </Dropdown>
              </td>
            </tr>
            ))
          }
            
           
          </tbody>
        </Table>
        <div className="d-flex justify-content-end mt-5">
      <Pagination>
      <Pagination.Prev onClick={setPrevPage} disabled={currentPage === 1} active={currentPage> 1}/>
      <Pagination.Item onClick={()=>setPage(1)} >{1}</Pagination.Item>
      <Pagination.Item disabled>{currentPage+'/'+orders.totalPages}</Pagination.Item>
      <Pagination.Item onClick={()=>setPage(orders.totalPages)}>{orders.totalPages}</Pagination.Item>
      <Pagination.Next onClick={setNextPage} disabled={orders.totalPages === currentPage} active={currentPage<orders.totalPages}/>
    </Pagination>
      </div>
      </div>
      )}
      {
        !orders.data_name?.length && (
          <div className="mt-5 text-center">Data not found</div>
        )
      } 
      
      <OrderStatus show={isOrderStatusOpen} onClose={handlOrderModalClose} order={order} />
      <PaymentStatus show={isPayMentStatusOpen} onClose={handlPaymentStatusModalClose} order={order} />
    </div>
  );
};
export default OrderList;

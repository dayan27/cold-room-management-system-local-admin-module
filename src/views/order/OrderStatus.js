import React,{useRef,useEffect,useState} from "react";
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button"
import ReactToPrint from "react-to-print";
import { useDispatch,useSelector } from "react-redux";
import { orderAction } from "../../store/slices/OrderSlice";
import classes from './Orders.module.css'
import apiClient from "../../url";

const OrderStatus = ({show,order,onClose}) => {
  const [orderLogs,setOrderLog] = useState([])
  const [orderStatus,setOrderStatus] = useState('pending')
  const [error,setError] = useState('')
  const user = useSelector(state=>state.user.data)
  const componentRef = useRef()
  const dispatch = useDispatch()
 useEffect(()=>{
  setOrderLog(order.orderLogs)
  setOrderStatus(order.orderStatus)
 },[order])
  const changeOrderStatus = async(e)=>{
    setOrderStatus(e.target.value)
    const newStatus = {
      orderStatus:e.target.value,
      orderId:order.id,
      changedBy:user.id
    }
    let response
    try{
      response = await apiClient.put(`localadmin/orders/${order.id}`,newStatus)
      if(response.status=== 200){
        setOrderLog(prevValue=>{
          return [...prevValue,response.data]
        })
        console.log('id2=',order.id)
        dispatch(orderAction.setOrderStatus({status:response.data.changedTo,id:order.id}))
        console.log('id3=',order.id)
      }
      
    }
    catch(err){
      if(response.status === 403){
        setError('imposible to change the status of completed order')
      }
      else{
        setError('faild to change order status')
        console.log('err=',err)
      }
    
     
    }
  }
  const closeModalHandler = () => {
    onClose();
    setError('')
  };
  return (
    <>
      <Modal
        show={show}
        size="xl"
        onHide={closeModalHandler}
        backdrop="static"
        keyboard={false}        
      >
      <Modal.Header closeButton className={classes.modalBg}>
          <Modal.Title >Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body className={classes.modalBg}>
        <div className="px-4 pb-3" ref={componentRef}>
          <div className="fw-bold px-3">Order Code: {order.orderCode}</div>
          <div className=" fw-bold mt-3 px-3">Order Status : {order.orderStatus}</div>
          <div className="d-flex align-items-center px-3 pt-2">              
            <div className="me-5 onPrintDnone">
            <Form.Select aria-label="order status" value={orderStatus} onChange={changeOrderStatus}>
            <option value='pending'>Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
            </div>
            <div className="ms-auto">
            <ReactToPrint
            trigger={()=><Button variant='none' className="exportbtn onPrintDnone py-1"><span><i className="fas fa-file-export"></i></span> Export</Button>}
            content={()=>componentRef.current}       
            documentTitle='new document'
            pageStyle='print'
            />
           </div>
          </div>
          <div className={`${classes.borderTop} mt-4 border rounded-3 bg-white`}>
          <div className="p-4">Order Status Change History</div>
          <Table responsive="md">
            <thead className=''>
              <tr>
                <th>Changed Date</th>
                <th>Changed From</th>
                <th>Changed To</th>
                <th>Changed By</th>
                
              </tr>
            </thead>
            <tbody>
            {
              orderLogs?.map((order) =>(
                <tr className={classes.tdPadding} key={order.id}>
                <td className='py-3'>{order.updatedAt.slice(0,10)}</td>
                <td className="p-2">{order.changedFrom}</td>
                <td className="p-2">{order.changedTo}</td>
                <td className="p-2">{order.changedBy}</td>
                
              </tr>
              ))
            }
              
             
            </tbody>
          </Table>
        </div>
       <div className="onPrintDnone">
       </div>
        </div>
        <div className="mt-3 text-center text-danger">{error}</div>
        </Modal.Body>       
       
      </Modal>
    </>
  );
};
export default OrderStatus;

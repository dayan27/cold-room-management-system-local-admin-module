import React,{useRef,useState,useEffect} from "react";
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';
import Table from "react-bootstrap/Table";
import ReactToPrint from "react-to-print";
import Button from "react-bootstrap/Button";
import SaveButton from '../../components/Button'
import { orderAction } from "../../store/slices/OrderSlice";
import { useSelector,useDispatch } from "react-redux";
import { buttonAction } from "../../store/slices/ButtonSpinerSlice";
import apiClient from "../../url";
import classes from './Orders.module.css'

const PaymentStatus = ({show,order,onClose}) => {
  const [paymentLogs,setPaymentLog] = useState([])
  const [paymentStatus,setPaymentStatus] = useState('unpaid')
  const [amount,setAmount]= useState(null)
  const [errors,setErrors] = useState({amount:'',notify:''})
  const user = useSelector(state=>state.user.data)
  const componentRef = useRef()
  const dispatch = useDispatch()
  useEffect(()=>{
    setPaymentLog(order.orderPaymentLogs)
    setPaymentStatus(order.paymentStatus)
  },[order,onClose])
  const changeHandler = async(e)=>{
    setAmount(e.target.value)  
    if(e.target.value){
      setErrors({})
    }
  }

  const savePayment = async()=>{
    let err = ''
    if(!amount){
      err= 'please enter payment amount'
    }
    else if(amount < 1){
      err = 'payment amount must be greater than zero'
    }
    setErrors(prevErr=>{
      return {...prevErr,amount:err}
    })
    if(!err){
      const newpayment = {
        amount:amount,
        orderId:order.id,
        changedBy:user.id
      }
      let response
    try{
      dispatch(buttonAction.setBtnSpiner(true))
      response = await apiClient.put(`localadmin/orders/payment/${order.id}`,newpayment)
      if(response.status=== 200){
        setPaymentLog(prevValue=>{
          return [...prevValue,response.data.paymentLog]
        })
        setPaymentStatus(response.data?.paymentStatus)
        dispatch(orderAction.setPaymentStatus({status:response.data.paymentStatus,id:order.id}))
      }
      
    }
    catch(err){
      if(err.response.status === 403){
        setErrors(preErr=>{
          return {...preErr,notify:err.response.data}
          })
        }
        else{
          setErrors(preErr=>{
            return {...preErr,notify:'faild to save payment'}
            })
        }
    }
    finally{
      dispatch(buttonAction.setBtnSpiner(false))
    }
    
    }

  }
  
  const closeModalHandler = () => {
    onClose();
    setErrors({})
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
      <Modal.Title >Payment Status</Modal.Title>
    </Modal.Header>
        <Modal.Body className={classes.modalBg}>
        <div className="px-4 py-3" ref={componentRef}>
        <div className="d-flex align-items-center">
        <div>
        <div className="fw-bold px-3 pt-3">Order Code: {order.orderCode}</div>
        <div className=" fw-bold mt-3 px-3">Payment Status : {paymentStatus}</div>
        </div>
          {
            paymentStatus !== "paid" &&(
              <div className="d-flex ms-5 mt-2 align-items-center">
              <Form.Group className="mb-3 onPrintDnone" controlId="payment">
           <Form.Label>Enter Payment Amount</Form.Label>
           <Form.Control
            type="number"
            min="1"
            onChange={changeHandler}
            className={errors.amount?classes.errorBorder:''}
            />
            <span className={classes.errorText}>{errors.amount}</span> 
         </Form.Group>
         <div className="ms-5 mt-2 onPrintDnone">
         <SaveButton title='Save' onSave={savePayment} />
         </div>
              </div>
            )}
        </div>
          <div className="d-flex align-items-center px-3 pt-2">              
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
          <div className="p-4">Payment Status Change History</div>
          <Table responsive="md">
            <thead className=''>
              <tr>
              <th>No</th>
                <th>Paid Date</th>
                <th>Paid Amount</th>
                <th>Payment Added By</th>
                
              </tr>
            </thead>
            <tbody>
            {
              paymentLogs?.map((log,index) =>(
                <tr className={classes.tdPadding} key={log.id}>
                <td className="p-2">{index+1}</td>
                <td className='py-3'>{log.updatedAt.slice(0,10)}</td>
                <td className="p-2">{log.paidAmount}</td>
                <td className="p-2">{log.changedBy}</td>
                
              </tr>
              ))
            }
              
             
            </tbody>
          </Table>
        </div>
        </div>
        <div className={`${classes.errorText} text-center`}>{errors.notify}</div>
        </Modal.Body>       
       
      </Modal>
    </>
  );
};
export default PaymentStatus;

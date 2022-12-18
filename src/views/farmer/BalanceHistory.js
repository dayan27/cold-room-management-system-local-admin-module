import { Fragment,useEffect,useRef,useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { balanceAction } from "../../store/slices/BalanceSlice";
import { isLoadingAction } from "../../store/slices/spinerSlice";
import { buttonAction } from "../../store/slices/ButtonSpinerSlice";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Modal from 'react-bootstrap/Modal';
import SaveButton from '../../components/Button'
import CancelButton from "../../components/CancelButton";
import ReactToPrint from "react-to-print";
import Button from 'react-bootstrap/Button';
import apiClient from "../../url/index";
import { useNavigate,useParams } from "react-router-dom";
import classes from "./Farmers.module.css";


const BalanceHistory = () => {

  const dispatch = useDispatch()
  const balances = useSelector(state =>state.balance.balances)
  const user = useSelector(state=>state.user.data)
  const [show,setShow] = useState(false)
  const [orderCode,setOrderCode] = useState(null)
  const [errors,setErrors]= useState({code:'',success:'',fail:''})
  const navigate = useNavigate()
  const componentRef = useRef()
  const {tb,faId} = useParams()
  async function  featchBalances(){
    dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/farmers/balances/${faId}?date=${''}`)
   if(response.status === 200){
    dispatch(balanceAction.setBalances(response.data || []))
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
}
  useEffect( ()=>{
 
  featchBalances()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const filterByDateHandler = async(e)=>{
    dispatch(isLoadingAction.setIsLoading(true))
    try{
     var response = await apiClient.get(`localadmin/farmers/balances/${faId}?date=${e.target.value}`)
     if(response.status === 200){
      dispatch(balanceAction.setBalances(response.data || []))
     }
    }
    catch(err){}
    finally {dispatch(isLoadingAction.setIsLoading(false))}
  }
 const openWithdrawMoney=()=>{
  setShow(true)
 }
 const handleClose = () =>{
  setShow(false)
  setErrors({})

 }
 const changeHandler = (e) =>{
  setOrderCode(e.target.value)
  if(e.target.value){
    setErrors({})
  }

 }
 const withdrawHandler = async() =>{
  let error =''
  if(!orderCode){
    error = 'please enter order code'
  }
  else if(orderCode.lengh<4){
    error = 'order code must be greaterthan 3 digits'
  }
  else if(orderCode.lengh > 6){
    error = 'order code must be lessthan 7 digits'
  }
  setErrors(prevError=>{
    return {...prevError,code:error}
  })
  const orderInfo = {
    orderCode:orderCode,
    farmerId:faId,
  }
  try{
    dispatch(buttonAction.setBtnSpiner(true))
    const response = await apiClient.post(`localadmin/farmers/withdraw/${faId}`,orderInfo)
    if(response.status === 200 || 201){
      dispatch(balanceAction.withdrawMoney(orderCode))
       setErrors(prevError=>{
        return {...prevError,success:'withdraw process is completed'}
       })
    }
  }
  catch(err){
    console.log('withdrawl err=',err)
    setErrors(prevError=>{
      return {...prevError,fail:'withdraw process is faild'}
     })
  }
  finally{
    dispatch(buttonAction.setBtnSpiner(false))
  }
 }
  return (
    <Fragment>
    <Button onClick={()=>navigate(-1)} variant='none' className={`${classes.boxShadow} fs-3 fw-bold`}><i className="fas fa-arrow-left"></i></Button> 
    <div ref={componentRef}>
   <div className="d-flex">
   <div>
   <div className="fw-bold">Farmers Balance History</div>
   <div className="mt-2"><span className="fw-bold">Cold Room</span>: {user.coldRoom?.name}</div>
     <div className="mt-3">
       <span className="fw-bold">Farmer</span>: {balances.farmer?.fName+' '+balances.farmer?.lName}
     </div>
     <div className="mt-3">
       <span className="fw-bold">Total Balance(ETB)</span>: {tb}
   </div>
   </div>
   <div className="ms-auto align-self-end">
   <Button variant="none" className={`${classes.btn} text-white`} onClick={openWithdrawMoney}>Withdraw Money</Button>
   </div>
   </div>
      <div className={`${classes.bottomBorder} mt-5`}></div>
        <div className={`${classes.grayBg} d-flex justify-content-end mt-3 p-2`}>
      
      <div className="ms-3 me-3 onPrintDnone">
      <Form.Group controlId="search-by-date">
      <Form.Control type="date" onChange={filterByDateHandler} />
    </Form.Group>
      </div>
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
              <th className="small">Order Code</th>
              <th className="small">Product Name</th>
              <th className="small">Product Type</th>
              <th className="small">Order Date</th>
              <th className="small">Quntity(Kg)</th>
              <th className="small">Price(ETB)</th>
              <th className="small">Rent Price</th>
              <th className="small">Rent Fee</th>
              <th className="small">Total Balance(ETB)</th>
              <th className="small">Net Balance(ETB)</th>
              <th className="small">Withdrawal State</th>
            </tr>
          </thead>
          <tbody>
          {
            balances.farmerBalances?.map((balance,index) =>(
              <tr className={classes.row} key={index}>
              <td className="p-3">{balance.orderCode}</td>
              <td className="p-3">{balance.productName}</td>
              <td className="p-3">{balance.productType}</td>
              <td className="p-3">{balance.orderDate.slice(0,10)}</td>
              <td className="p-3">{balance.quantity}</td>
              <td className="p-3 text-center">{balance.price}</td>
              <td className="p-3 text-center">{balance.rentPrice}</td>
              <td className="p-3 text-center">{balance.rentAmount}</td>
              <td className="p-3 text-center">{balance.balanceAmount}</td>
              <td className="p-3 text-center">
              {balance.balanceAmount - balance.rentAmount}
              </td>
            <td className="p-3 text-center">{balance.state*1?"withdrawed":"Unwithdraw"}</td>
            </tr>
            ))
          }
            
           
          </tbody>
        </Table>
      </div>
      </div>
      <div>
      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Withdraw Money</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="ms-5 p-3">
      <Form.Group className="mb-3" controlId="withdraw">
   <Form.Label>Enter Order Code</Form.Label>
   <Form.Control
    type="number"
    onChange={changeHandler}
    className={errors.code?classes.errorBorder:''}
    />
    <span className={classes.errorText}>{errors.code}</span> 
 </Form.Group>
 <div className="my-2 text-success">{errors.success}</div>
 <div className={`${classes.errorText} my-2`}>{errors.fail}</div>
 <div className="d-flex justify-content-end ms-5 mt-5">
 <div className="me-4"><CancelButton title="Cancel" onClose={handleClose} /></div>
 <SaveButton title='Withdraw' onSave={withdrawHandler} />
 </div>
      </div>
      </Modal.Body>
    </Modal>
      </div>
    </Fragment>
  );
};
export default BalanceHistory;

import { useEffect,useRef } from "react";
// import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { wholesalerAction } from "../../store/slices/WholesalerSlice";
import { isLoadingAction } from "../../store/slices/spinerSlice";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import ReactToPrint from "react-to-print";
import Button from 'react-bootstrap/Button';
import apiClient from "../../url/index";
import { useNavigate } from "react-router-dom";
import classes from "./WholeSalers.module.css";


const WholeSalerList = () => {
  const dispatch = useDispatch()
  const wholesalers = useSelector(state =>state.wholesaler.wholesalers)
  const user = useSelector(state =>state.user.data)
  const navigate = useNavigate()
  const componentRef = useRef()
  const searchBy = useRef()

  const featchWholesalers = async() =>{
    dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/wholesalers?coldRoomId=${user.coldRoom.id}&search=${searchBy.current.value}`)
   if(response.status === 200){
    dispatch(wholesalerAction.setWholesalers(response.data || []))
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
}
  useEffect( ()=>{   
  featchWholesalers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user])


  const orderHistoryHandler = (whId) =>{
    navigate(`/wholesalers/${whId}/order-history`)
  }
  const enterKeyHandler = (event) =>{
    if(event.key === 'Enter' || !event.target.value){
      featchWholesalers()
    }
  }
  const searchHandler = () =>{
    featchWholesalers()
  }
  return (
    <div ref={componentRef}>
      <h5 className="text-bold">Wholesalers List</h5>
      <p className={`${classes.titleP} fw-bold small`}>
        In the Wholesalers section you can view  all list of Wholesalers and there order history.      their details. 
      </p>
      <div className={`${classes.bottomBorder} mt-5`}></div>
        <div className={`${classes.grayBg} d-flex justify-content-between mt-3 p-2`}>
        <InputGroup className="w-50 border rounded onPrintDnone">
          <InputGroup.Text id="basic-addon1" className={classes.searchIcon}>
            <span onClick={searchHandler}>
              <i className="fas fa-search"></i>
            </span>
          </InputGroup.Text>
          <Form.Control
            className={classes.searchInput}
            placeholder="search orders by wholsaler name"
            aria-label="Username"
            aria-describedby="basic-addon1"
            onKeyUp={enterKeyHandler}
            ref={searchBy }
          />
        </InputGroup>        
      
        <div className="ms-auto">
        <ReactToPrint
        trigger={()=><Button variant='none' className="exportbtn onPrintDnone py-1"><span><i className="fas fa-file-export"></i></span> Export</Button>}
        content={()=>componentRef.current}       
        documentTitle='new document'
        pageStyle='print'
        />
        </div>
      </div>
      {wholesalers?.length > 0 && (
    <div className="mt-4">
        <Table responsive="md">
          <thead className={classes.header}>
            <tr>
              <th>NO</th>
              <th>Wholesaler's Name</th>
              <th>City</th>
              <th className="text-end">Phone Number</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {
            wholesalers.map((wholsaler,index) =>(
              <tr className={classes.row} key={wholsaler.id}>
              <td className="p-3">{index+1}</td>
              <td className="p-3">{wholsaler.fName+' '+wholsaler.lName}</td>
              <td className="p-3">{wholsaler.address?.location}</td>
              <td className="p-3 text-end">{wholsaler.phoneNumber}</td>
            <td className="p-3 text-end">
            <Button 
             variant="none"
             className={`${classes.btn} onPrintDnone`}
             onClick={()=>orderHistoryHandler(wholsaler.id)}>Order History</Button>
              </td>
            </tr>
            ))
          }
            
           
          </tbody>
        </Table>
      </div>
      )}
      {
        wholesalers?.length === 0 &&(
          <div className="mt-5 text-center">No wholesaler data found</div>
        )
      }
      </div>
  );
};
export default WholeSalerList;

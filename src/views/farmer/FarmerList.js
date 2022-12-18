import {Fragment, useEffect,useRef, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { farmerAction } from "../../store/slices/FarmerSlice";
import { isLoadingAction } from "../../store/slices/spinerSlice";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import ReactToPrint from "react-to-print";
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import EditFarmer from "./EditFarmer";
import apiClient from "../../url/index";
import { useNavigate } from "react-router-dom";
import classes from "./Farmers.module.css";


const FarmersList = () => {
 const user = useSelector(state=>state.user.data)
  const dispatch = useDispatch()
  const farmers = useSelector(state =>state.farmer.farmers)
  const [farmer,setFarmers] = useState({})
  const [show,setShow] = useState(false)
  const navigate = useNavigate()
  const componentRef = useRef()
  const searchBy = useRef()

  const featchFarmers = async() =>{
    dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/farmers?search=${searchBy.current.value}&coldRoomId=${user.coldRoom.id}`)
   if(response.status === 200){
    dispatch(farmerAction.setFarmers(response.data || []))
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
}
  useEffect( ()=>{
   
  featchFarmers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user])

  const handlBalanceHistory = (tbc,id) =>{
    navigate(`/farmers/${id}/balance/${tbc}`)
  }
  const handlEditFarmer = (farmer) =>{
    setFarmers(farmer)
    setShow(true)
}
const handlProductHistory = (tp,id) =>{
    navigate(`/farmers/${id}/product-history/${tp}`)
}
const enterKeyHandler = (event) =>{
  if(event.key === 'Enter' || !event.target.value){
    featchFarmers()
  }
}
const searchHandler = () =>{
  featchFarmers()
}
const closeEditModal = () =>{
  setShow(false)
}
  return (<Fragment>
    <div ref={componentRef}>
      <h5 className="text-bold">Farmers List</h5>
      <p className={`${classes.titleP} fw-bold small`}>
        In the Farmers section you can view  all farmers related information with
        their detail. 
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
            placeholder="search orders by farmer name"
            ref={searchBy}
            aria-label="Username"
            aria-describedby="basic-addon1"
            onKeyUp={enterKeyHandler}
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
      {farmers.length > 0 &&(
      <div className="mt-4">
        <Table responsive="md">
          <thead className={classes.header}>
            <tr>
              <th className="small">NO</th>
              <th className="small">Farmer Name</th>
              <th className="small">Phone Number</th>
              <th className="small">Region</th>
              <th className="small">Zone</th>
              <th className="small">Woreda</th>
              <th className="small">Kebele</th>
              <th className="small">Product(Kg)</th>
              <th className="small">Rent Fee(ETB)</th>
              <th className="small">Balance(ETB)</th>
              <th className=""></th>
            </tr>
          </thead>
          <tbody>
          {
            farmers.map((farmer,index) =>(
              <tr className={classes.row} key={farmer.id}>
              <td className="p-3">{index+1}</td>
              <td className="p-3">{farmer.fName+' '+farmer.lName}</td>
              <td className="p-3">{farmer.phoneNumber}</td>
              <td className="p-3">{farmer.address.region}</td>
              <td className="p-3">{farmer.address.zone}</td>
              <td className="p-3">{farmer.address.woreda}</td>
              <td className="p-3">{farmer.address.kebele}</td>
              <td className="p-3 text-center">{farmer.totalProduct}</td>
              <td className="p-3 text-center">{farmer.totalRent}</td>
              <td className="p-3 text-center">{farmer.totalBalance}</td>
            <td className="p-3 onPrintDnone">
              <Dropdown>
      <Dropdown.Toggle variant="none" id="dropdown-basic">
      <i className="fas fa-ellipsis-v"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu className={classes.dropdownBg}>
      <Button
        variant="none"
        className={`${classes.dropdownItem} border-bottom w-100 rounded-0 text-start ps-3`}
        onClick={()=>handlBalanceHistory(farmer.totalBalance,farmer.id)}>Balance History</Button>
      <Button
        variant="none"
         className={`${classes.dropdownItem} border-bottom w-100 rounded-0 text-start ps-3`}
          onClick={()=>handlProductHistory(farmer.totalProduct,farmer.id)}>Product History
          </Button>
            <Button
            variant="none"
            className={`${classes.dropdownItem} border-bottom w-100 rounded-0 text-start ps-3`}
             onClick={()=>handlEditFarmer(farmer)}>Edit Farmer</Button>
        </Dropdown.Menu>
    </Dropdown>
              </td>
            </tr>
            ))
          }
            
           
          </tbody>
        </Table>
      </div>
      )}
      {farmers.length === 0 &&(
        <div className="mt-5 text-center">No farmers found</div>
      )}
      </div>
      <EditFarmer show={show} farmer={farmer} onClose={closeEditModal}/>
      </Fragment>
  );
};
export default FarmersList;

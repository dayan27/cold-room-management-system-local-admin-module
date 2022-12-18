import {useState,useRef} from 'react'
import ProductSelection from "./ProductSelection"
import InputGroup from 'react-bootstrap/InputGroup'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import apiClient from '../../url'
import classes from './Products.module.css'
const AddProductExistingCustomer = () =>{
  const user = useSelector(state=>state.user.data)
  const [farmers,setFarmer] =useState([])
  const [farmerId,setFarmerId] = useState(null)
    const searchBy = useRef()
    const navigate = useNavigate()

    const searchHandler = async () =>{
      try{
     const response = await apiClient.get(`localadmin/farmers/search?search=${searchBy.current.value}&coldRoomId=${user.coldRoom.id}`)
     if(response.status === 200){
      if(response.data?.length>0){
      setFarmer(response.data)
      }
      else{
        setFarmer([])
      }
     }
      }
      catch(err){}
    }
    const addNewCustomerProduct = () =>{
      navigate('/products/add-product/new-farmer-product')
    }
    const selectFarmerHandler = (e) =>{
      console.log('selected farmer id=',e.target.value)
      setFarmerId(e.target.value)
    }
    return <>
   
    <div className={`${classes.grayBg} d-flex mt-3 p-2`}>
    <InputGroup className="mb-3 w-50 border rounded onPrintDnone">
    <InputGroup.Text id="basic-addon1" className={classes.searchIcon}>
      <span onClick={searchHandler}>
        <i className="fas fa-search"></i>
      </span>
    </InputGroup.Text>
    <Form.Control
      className={classes.searchInput}
      placeholder="search by farmer name"
      aria-label="productName"
      aria-describedby="basic-addon1"
      ref={searchBy}
      onKeyUp={searchHandler}
    />
  </InputGroup>
    <div>
    </div>
    <div className='ms-5'>
    <Button variant='none' className={`${classes.viewHistoryBtn} px-5 py-1`} onClick={addNewCustomerProduct}>New Farmer</Button>
    </div>
  </div>
  {
    farmers?.length > 0 && (
  <div className="my-4 border border-dark rounded-3">  
  <Table responsive="md">
    <thead className={classes.header}>
      <tr>
        <th>NO</th>
        <th>Farmer Name</th>
        <th>Phone Number</th>
        <th>Location</th>
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
        <td className="p-3">{farmer.address.location}</td>
        <td className="p-3 text-center">
        <Form.Check 
        type="radio"
        name='farmer'
        value={farmer.id}
        id={farmer.id}
        onChange={selectFarmerHandler}
      />
           </td>
      </tr>
      ))
    }     
     
    </tbody>
  </Table>
  
</div>
)}
    <ProductSelection farmerId={farmerId} isNewFarmer={false} />
    </>
}
export default AddProductExistingCustomer
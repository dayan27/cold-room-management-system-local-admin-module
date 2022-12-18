import { useEffect,useRef } from "react";
import { useSelector,useDispatch } from "react-redux";
import { rentAction } from "../../store/slices/RentSlice";
import { isLoadingAction } from "../../store/slices/spinerSlice";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import Button from 'react-bootstrap/Button';
import ReactToPrint from "react-to-print";
import apiClient from "../../url/index";
import { useNavigate,useParams } from "react-router-dom";
import classes from "./Farmers.module.css";


const RetFee = () => {

  const dispatch = useDispatch()
  const rents = useSelector(state =>state.rent.rents)
  // const user = useSelector(state =>state.user.data)
  const navigate = useNavigate()
  const {tr,faId} = useParams()
  const componentRef = useRef()

  async function  featchRents(){
    dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/farmers/rents/${faId}`)
   if(response.status === 200){
    dispatch(rentAction.setRents(response.data || []))
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
}
  useEffect( ()=>{
  featchRents()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div ref={componentRef}>
    <Button onClick={()=>navigate(-1)} variant='none' className={`${classes.boxShadow} fs-3 fw-bold onPrintDnone`}><i className="fas fa-arrow-left"></i></Button> 
    <div className="fw-bold">Farmers rent fee</div>
    <div className="d-flex align-items-center">
    <div>
      <div className="mt-3">
        <span className="fw-bold">Farmer</span>: {rents.farmer?.fName+' '+rents.farmer?.lName}
      </div>
      <div className="mt-3">
        <span className="fw-bold">Total Rennt Fee</span>: {tr} ETB
      </div>
    </div>
   
  </div>
      <div className={`${classes.bottomBorder} mt-5`}></div>
        <div className={`${classes.grayBg} d-flex justify-content-between mt-3 p-2`}>
        <InputGroup className="w-50 border rounded onPrintDnone">
          <InputGroup.Text id="searchbyproductName" className={classes.searchIcon}>
            <span>
              <i className="fas fa-search"></i>
            </span>
          </InputGroup.Text>
          <Form.Control
            className={classes.searchInput}
            placeholder="search by Product name"
            aria-label="search by product name"
            aria-describedby="searchbyproductName"
          />
        </InputGroup>
        <div className="ms-3 onPrintDnone">
        <Form.Select aria-label="Default select example">
        <option value='all'>All</option>
        <option value="1">Type 1</option>
        <option value="2">Type 2</option>
        <option value="3">Type 3</option>
      </Form.Select>
        </div>
      <div className="ms-3 me-3 onPrintDnone">
      <Form.Group controlId="search-by-date">
      <Form.Control type="date" />
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
      {rents.farmerRents.length > 0 &&(
        <Table responsive="md">
          <thead className={classes.header}>
            <tr>
              <th>Order-ID</th>
              <th>Product Name</th>
              <th>Product Type</th>
              <th>Order Date(GC)</th>
              <th>Sold Quantity(Kg)</th>
              <th>Rent Fee pre Kg(ETB)</th>
              <th>Total Rent Fee(ETB)</th>
              <th>Pament Status</th>
            </tr>
          </thead>
          <tbody>
          {
            rents.farmerRents?.map((order,index) =>(
              <tr className={classes.row} key={index}>
              <td className="p-3">{order.orderCode}</td>
              <td className="p-3">{order.productName}</td>
              <td className="p-3">{order.productType}</td>
              <td className="p-3">{order.orderDate.slice(0,10)}</td>
              <td className="p-3 text-center">{order.quantity}</td>
              <td className="p-3 text-center">{order.rentPrice}</td>
              <td className="p-3 text-center">{order.rentAmount}</td>
            <td className="p-3 text-center">{order.state}</td>
            </tr>
            ))
          }
            
           
          </tbody>
        </Table>
        )}
        {
          rents.farmerRents.length === 0 &&(
            <div className="mt-5 text-center">No rent data is found</div>
          )
        }
      </div>
    </div>
  );
};
export default RetFee;

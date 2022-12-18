import { Fragment,useEffect,useRef,useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { salesAction } from "../../store/slices/SalesSlice";
import { isLoadingAction } from "../../store/slices/spinerSlice";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import ReactToPrint from "react-to-print";
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination'
import apiClient from "../../url/index";
import classes from "./Sales.module.css";


const Sales = () => {
  const [currentPage,setCurrentPage] =useState(1)
  const user = useSelector(state =>state.user.data)
  const dispatch = useDispatch()
  const saleses = useSelector(state =>state.sales.saleses)
  const componentRef = useRef()
  const searchBy = useRef()
   const  featchSaleses = async() =>{
    dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/sales?search=${searchBy.current.value}&coldRoomId=${user.coldRoom.id}&date=${''}&page=${currentPage}`)
   if(response.status === 200){
    dispatch(salesAction.setSales(response.data || []))
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
}
  useEffect( ()=>{
    
  featchSaleses()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentPage,user])
 const searchByHandler = async() =>{
  dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/sales?search=${searchBy.current.value}&coldRoomId=${user.coldRoom.id}&date=${''}&page=${1}`)
   if(response.status === 200){
    dispatch(salesAction.setSales(response.data || []))
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
  setCurrentPage(1)
 }
  const enterKeyHandler = (event) =>{
    if(event.key === 'Enter' || !event.target.value){
      searchByHandler()
    }
  }
  const searchHandler = () =>{
    searchByHandler()
  }
    const filterByDateHandler = async(e) =>{
      dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/sales?search=${searchBy.current.value}&coldRoomId=${user.coldRoom.id}&date=${e.target.value}&page=${currentPage}`)
   if(response.status === 200){
    dispatch(salesAction.setSales(response.data || []))
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
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
    <Fragment>
    <div ref={componentRef}>
    <div className="fw-bold">Sales List</div>
      <div className={`${classes.bottomBorder} mt-5`}></div>
        <div className={`${classes.grayBg} d-flex justify-content-between mt-3 p-2`}>
        <InputGroup className="w-50 border rounded onPrintDnone">
          <InputGroup.Text id="searchbyfarmerName" className={classes.searchIcon}>
            <span onClick={searchHandler}>
              <i className="fas fa-search"></i>
            </span>
          </InputGroup.Text>
          <Form.Control
            className={classes.searchInput}
            placeholder="search orders by wholesaler's name"
            aria-label="search by product name"
            aria-describedby="searchbyproductName"
            ref={searchBy}
            onKeyUp={enterKeyHandler}
          />
        </InputGroup>
      <div className="ms-3 me-3 onPrintDnone">
      <Form.Group controlId="search-by-date">
      <Form.Control 
      type="date"
      onChange={filterByDateHandler}
       />
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
      {
        saleses.data_name?.length && (
      <div className="mt-4">
        <Table responsive="md">
          <thead className={classes.header}>
            <tr>
              <th className="small">Order Code</th>
              <th className="small">Wholesaler Name</th>
              <th className="small">Order Date</th>
              <th className="small">Order Status</th>
              <th className="small">Total Price</th>             
              <th className="small">Payment Status</th>
              <th className="small">Paid Amount(ETB)</th>
              <th className="small">Remaining Amount(ETB)</th>
            </tr>
          </thead>
          <tbody>
          {
            saleses.data_name.map((sales,index) =>(
              <tr className={classes.row} key={index}>
              <td className="px-2 py-3 text-center">{sales.orderCode}</td>
              <td className="px-2 py-3 text-center">{sales.wholeSaler?.fName+' '+sales.wholeSaler?.lName}</td>
              <td className="px-2 py-3 text-center">{sales.createdAt.slice(0,10)}</td>
              <td className="px-2 py-3 text-center">{sales.orderStatus}</td>
              <td className="px-2 py-3 text-center">{sales.totalPrice}</td>              
              <td className="px-2 py-3 text-center">{sales.paymentStatus}</td>
              <td className="px-2 py-3 text-center">{sales.paidAmount}</td>
              <td className="px-2 py-3 text-center">{sales.totalPrice-sales.paidAmount}</td>
              
            </tr>
            ))
          }
            
           
          </tbody>
        </Table>
        <div className="d-flex justify-content-end mt-5">
        <Pagination>
        <Pagination.Prev onClick={setPrevPage} disabled={currentPage === 1} active={currentPage> 1}/>
        <Pagination.Item onClick={()=>setPage(1)} >{1}</Pagination.Item>
        <Pagination.Item disabled>{currentPage+'/'+saleses.totalPages}</Pagination.Item>
        <Pagination.Item onClick={()=>setPage(saleses.totalPages)}>{saleses.totalPages}</Pagination.Item>
        <Pagination.Next onClick={setNextPage} disabled={saleses.totalPages === currentPage} active={currentPage<saleses.totalPages}/>
      </Pagination>
        </div>
      </div>
      )
      }
      {
        !saleses.data_name?.length && (
          <div className="mt-5 text-center">No sales data found</div>
        )
      }
      </div>
    </Fragment>
  );
};
export default Sales;

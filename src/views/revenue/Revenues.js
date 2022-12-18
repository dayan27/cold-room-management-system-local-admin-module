import { Fragment,useEffect,useRef,useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { revenueAction } from "../../store/slices/RevenueSlice";
import { isLoadingAction } from "../../store/slices/spinerSlice";
import Form from "react-bootstrap/Form";
import Pagination from 'react-bootstrap/Pagination'
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import ReactToPrint from "react-to-print";
import Button from 'react-bootstrap/Button';
import apiClient from "../../url/index";
import classes from "./Revenues.module.css";


const Revenue = () => {
  const [currentPage,setCurrentPage] =useState(1)
  const dispatch = useDispatch()
  const revenues = useSelector(state =>state.revenue.revenues)
  const user = useSelector(state=>state.user.data)
  const componentRef = useRef()
  const searchBy = useRef()

  const  featchRevenues = async() =>{
    dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/revenues?search=${searchBy.current.value}&page=${currentPage}&coldRoomId=${user.coldRoom.id}`)
   if(response.status === 200){
    dispatch(revenueAction.setRevenues(response.data || []))
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
}
  useEffect( ()=>{
      featchRevenues()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentPage,user])
const searchByHandler = async () =>{
  dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/revenues?search=${searchBy.current.value}&page=${1}&coldRoomId=${user.coldRoom.id}`)
   if(response.status === 200){
    dispatch(revenueAction.setRevenues(response.data || []))
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
       var response = await apiClient.get(`localadmin/revenues?search=${searchBy.current.value}&date=${e.target.value}&coldRoomId=${user.coldRoom.id}&page=${1}`)
       if(response.status === 200){
        dispatch(revenueAction.setRevenues(response.data || []))
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
    <div className="fw-bold">Rent Revenue List</div>
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
            placeholder="search orders by farmer name"
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
        revenues?.data_name?.length > 0 &&(
          <div className="mt-4">
          <Table responsive="md">
            <thead className={classes.header}>
              <tr>
                <th className="small">Farmer Name</th>
                <th className="small">Product Name</th>
                <th className="small">Product SQU</th>
                <th className="small">Product Type</th>
                <th className="small">Added Date</th>
                <th className="small">Sold Date</th>
                <th className="small">Quantity(Kg)</th>
                <th className="small">Rent Profit(ETB)</th>
              </tr>
            </thead>
            <tbody>
            {
              revenues.data_name?.map((revenue,index) =>(
                <tr className={classes.row} key={index}>
                <td className="p-3">{revenue.farmer.fName+' '+revenue.farmer.lName}</td>
                <td className="p-3">{revenue.productName}</td>
                <td className="p-3">{revenue.warehousePosition}</td>
                <td className="p-3">{revenue.productType}</td>
                <td className="p-3">{revenue.addedDate?.slice(0,10)}</td>
                <td className="p-3">{revenue.soldDate?.slice(0,10)}</td>
                <td className="p-3 text-center">{revenue.quantity}</td>
                <td className="p-3 text-center">{revenue.amount}</td>
                
              </tr>
              ))
            }
              
             
            </tbody>
          </Table>
          <div className="d-flex justify-content-end mt-5">
          <Pagination>
          <Pagination.Prev onClick={setPrevPage} disabled={currentPage === 1} active={currentPage> 1}/>
          <Pagination.Item onClick={()=>setPage(1)} >{1}</Pagination.Item>
          <Pagination.Item disabled>{currentPage+'/'+revenues.totalPages}</Pagination.Item>
          <Pagination.Item onClick={()=>setPage(revenues.totalPages)}>{revenues.totalPages}</Pagination.Item>
          <Pagination.Next onClick={setNextPage} disabled={revenues.totalPages === currentPage} active={currentPage<revenues.totalPages}/>
        </Pagination>
          </div>
        </div>
        )
      }
     {
      !revenues?.data_name?.length &&(
        <div className="mt-5 text-center">No revenue data found</div>
      )
     }
      </div>
    </Fragment>
  );
};
export default Revenue;

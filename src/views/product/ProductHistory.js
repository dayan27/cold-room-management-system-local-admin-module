import { Fragment,useEffect,useRef,useState } from "react";
import Table from "react-bootstrap/Table";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import Pagination from 'react-bootstrap/Pagination';
import ReactToPrint from "react-to-print";
import EditFarmerProduct from "./EditFarmerProduct";
import NotificationModal from "../../components/NotificationModal";
import apiClient from "../../url/index";
import {useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { isLoadingAction } from "../../store/slices/spinerSlice";
import { productAction } from "../../store/slices/ProductSlice";
import ConfirmModal from "../../components/ConfirmationModal";

import classes from "./Products.module.css";



const ProductHistory = () => {
  const [show,setShow] = useState(false)
  const [product,setProduct] = useState({})
  const [showConfirm,setShowConfirm] = useState(false)
  const [currentPage,setCurrentPage] = useState(1)
  const [totalProduct,setTotalProduct] = useState(null)
  const[modalData,setModalData] = useState({show:false,status:null,title:'',message:''})
  const [id,setId] = useState(null)
  const dispatch = useDispatch()
  const productsHistry = useSelector(state =>state.product.productHistries)
  const user = useSelector(state=>state.user.data)
  const navigate = useNavigate()
  const componentRef = useRef()  
  const searchBy = useRef()

  async function  featchProductHistory(){
    dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/products/history?coldRoomId=${user.coldRoom.id}&search=${searchBy.current.value.trim()}&date=${''}&page=${currentPage}`)
   if(response.status === 200){
    dispatch(productAction.setProductHistory(response.data || []))
    let sum=0
  response.data.data_name?.forEach(product=>{
    sum=sum+product.currentQuantity
  })
  setTotalProduct(sum)
   }
  }
  catch(err){}
  finally {dispatch(isLoadingAction.setIsLoading(false))}
}
  useEffect( ()=>{    
  featchProductHistory()
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentPage,user])
  const searchByHandler = async()=>{
    dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/products/history?coldRoomId=${user.coldRoom.id}&search=${searchBy.current.value.trim()}&date=${''}&page=${1}`)
   if(response.status === 200){
    dispatch(productAction.setProductHistory(response.data || []))
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
  const searchHandler = async() =>{
    searchByHandler()
  }
  const filterByDateHandler = async(e) =>{
    dispatch(isLoadingAction.setIsLoading(true))
    try{
     var response = await apiClient.get(`localadmin/products/history?coldRoomId=${user.coldRoom.id}&search=${searchBy.current.value.trim()}&date=${e.target.value}&page=${1}`)
     if(response.status === 200){
      dispatch(productAction.setProductHistory(response.data || []))
     }
    }
    catch(err){}
    finally {dispatch(isLoadingAction.setIsLoading(false))}
    setCurrentPage(1)
  }
  const openDeleteConfirmModal = (id) =>{
        setId(id)
        setShowConfirm(true)
      }
      const closeConfirmModal = () =>{
        setShowConfirm(false)
      }
  const deleteFarmerProduct = async () =>{
    try{
       const response = await apiClient.delete(`localadmin/products/${id}`)
      if(response.status === 200){
        dispatch(productAction.deleteHistory(id))
        setModalData({show:true,status:1,title:'Successful',message:'You deleted farmer product successfully'})
      }
    }
    catch(err){
      console.log('errr=',err)
      if(err.response.status === 403){
        setModalData({show:true,status:0,title:'Faild',message:'impossible to delete sold  farmer product'})
      }
      else{
        setModalData({show:true,status:0,title:'Faild',message:'faild to delet farmer product'})
      }
      
    }
  } 
  const openEditModal = (product) =>{
    setShow(true)
    setProduct(product)
  }
  const closeEditModal = ()=>{
    setShow(false)
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
  const handleModalClose =() =>{
    setModalData({})
  }
  return (
    <Fragment>
    <Button onClick={()=>navigate(-1)} variant='none' className={`${classes.boxShadow} fs-3 fw-bold`}><i className="fas fa-arrow-left"></i></Button> 
    <div ref={componentRef}>
      <div className="fw-bold">Product history</div>
      <div className="d-flex justify-content-between">
      <div>
        <div className="mt-3">
          <span className="fw-bold">Cold room</span>: {user.coldRoom?.name}</div>
        <div className="mt-3">
          <span className="fw-bold">Total product stocks</span>: {totalProduct}kg
        </div>
      </div>
    </div>
      <div className={`${classes.bottomBorder} mt-5`}></div>
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
          onKeyUp={enterKeyHandler}
        />
      </InputGroup>
      <div className="ms-auto me-3 onPrintDnone">
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
      {productsHistry.data_name?.length > 0 && (
      <div className="mt-4">
        <Table responsive="md">
          <thead className={classes.header}>
            <tr>
              <th>Farmer</th>
              <th>Product SKU</th>
              <th>Product</th>
              <th>Type</th>  
              <th>Quality</th>
              <th>Quantity(Kg)</th>  
              <th>Added Date</th>            
               <th></th>
            </tr>
          </thead>
          <tbody>
          {
            productsHistry.data_name?.map((product) =>(
              <tr className={classes.row} key={product.id}>
              <td className="py-4">{product.farmer.fName+' '+product.farmer.lName}</td>
              <td className="py-4">{product.warehousePosition}</td>
              <td className="py-4">{product.product?.name}</td>
              <td className="py-4">{product.productType.title}</td>
              <td className="py-4">{product.quality}</td>
              <td className="py-4">{product.currentQuantity}</td>
              <td className="py-4">{product.createdAt.slice(0,10)}</td>
              <td>
              <div className="d-flex">
              <button className={`${classes.editBtn} fs-5`} onClick={()=>openEditModal(product)}><i className="fas fa-edit"></i></button>
              <button className={`${classes.editBtn} fs-5 ms-2`} onClick={()=>openDeleteConfirmModal(product.id)}> <i className="fas fa-trash"></i></button>
              </div>
             
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
        <Pagination.Item disabled>{currentPage+'/'+(productsHistry.totalPages)}</Pagination.Item>
        <Pagination.Item onClick={()=>setPage(+productsHistry.totalPages)}>{+productsHistry.totalPages}</Pagination.Item>
        <Pagination.Next onClick={setNextPage} disabled={+productsHistry.totalPages === currentPage} active={currentPage<productsHistry.totalPages}/>
      </Pagination>
        </div>
      </div>
      )}
      </div>
     
    <EditFarmerProduct show={show} product={product} onClose={closeEditModal} />
    <ConfirmModal show={showConfirm} onClose={closeConfirmModal} onDelete={deleteFarmerProduct} message='Are you sure to delete Farmer product ?' title='Delete Farmer Product' />
    <NotificationModal modal={modalData} onClose={handleModalClose} />
    </Fragment>
  );
};
export default ProductHistory;

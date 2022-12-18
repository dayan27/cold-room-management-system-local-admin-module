import { useState,useRef,useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from 'react-bootstrap/Button';
import ReactToPrint from "react-to-print";
import {useDispatch,useSelector } from "react-redux";
import { isLoadingAction } from "../../store/slices/spinerSlice";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import SaveButton from '../../components/Button'
import CancelButton from "../../components/CancelButton";

import { buttonAction } from "../../store/slices/ButtonSpinerSlice";
import apiClient from "../../url/index";
import { useParams,useNavigate } from "react-router-dom";
import classes from "./Products.module.css";


const ProductDetail = () => {
    const [productTypes,setProductTypes] = useState([])
  const [show,setShow] = useState(false)
  const [producttoedited,setProduct] = useState({})
  const [price,setPrice] = useState(null)
  const [error,setError] = useState('')
  const user = useSelector(state=>state.user.data)
  const componentRef = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {prId} = useParams()

  const featchProductDetails = async ()=>{
    dispatch(isLoadingAction.setIsLoading(true))
  try{
   var response = await apiClient.get(`localadmin/products/get-price/${prId}`)
   if(response.status === 200){
    setProductTypes(response.data)
   
   }
  }
  catch(err){
    console.log(err)
  }
  finally {dispatch(isLoadingAction.setIsLoading(false))}
}
   useEffect(()=>{   
    featchProductDetails()
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[])
  const editProductTypePriceHandler = (product) =>{
    setProduct(product)
    setShow(true)
    setPrice(product.price?? 0)
  }
  const priceChangeHandler = (e) =>{
    setPrice(e.target.value)
  }
  const saveProductTypePrice = async() =>{
    let errorValu = ''
    if(!price){
       errorValu = 'please enter current price'
      }
      else if(price.length > 4){
        errorValu = 'price vale must be lessthan 4 digits'
      }
    setError(errorValu)
    const priceData = {
      coldRoomId:user.coldRoom.id,
      productId:producttoedited.productId,
      productTypeId:producttoedited.id,
      price:price,
    }
    if(!errorValu){
        try{
          dispatch(buttonAction.setBtnSpiner(true))
          const response = await apiClient.post(`localadmin/products/set-price`,priceData)
          if(response.status === 200 || 201){
            const index = productTypes.findIndex(type=>type.id===producttoedited.id)
            const productType = [...productTypes]
            productType[index].price = price
            setProductTypes(productType)
            setShow(false)
            

            
          }
        }
        catch(err){}
        finally{
          dispatch(buttonAction.setBtnSpiner(false))
        }
  }
}
  const handleClose = () =>{
    setShow(false)
    setError('')
  }
 console.log('producttoedited',producttoedited)
  return (
    <div ref={componentRef}>
    <Button onClick={()=>navigate(-1)} variant='none' className={`${classes.boxShadow} fs-3 fw-bold`}><i className="fas fa-arrow-left"></i></Button> 
      <h5 className="text-bold">Product Details</h5>
      <p className={`${classes.titleP} fw-bold small`}>
        In the product Details section you can review and manage  product with
        their type.You can view and edit product type price.
        </p>
      <div className={classes.bottomBorder}>
       
      </div>
      <div className="d-flex justify-content-end mt-4">
        <div>
        <ReactToPrint
        trigger={()=><Button variant='none' className="exportbtn py-1 onPrintDnone"><span><i className="fas fa-file-export"></i></span> Export</Button>}
        content={()=>componentRef.current}       
        documentTitle='new document'
        pageStyle='print'
        />
          
        </div>
      </div>
      <div className="mt-3">
        <Table responsive="md">
          <thead className={classes.header}>
            <tr>
              <th>NO</th>
              <th>Product Type</th>
              <th>Product Type Image</th>
              <th>Price Pre Kg</th>
              <th className="onPrintDnone"></th>
            </tr>
          </thead>
          <tbody>
          {
            productTypes.map((product,index) =>(
              <tr key={product.id}>
              <td className="p-4">{index+1}</td>
              <td className="p-4">{product.title}</td>
              <td className="pb-0 mb-0">
              <div className={`${classes.imgSize} mt-2`}>
                <img src={product.imageUrl} alt="product_Image" className={`${classes.img} img-fluid`} />
                </div>
              </td>
              <td className="p-4">{product.price?product.price:0}</td>
              <td className={`onPrintDnone`}>
            <div className="d-flex justify-content-end align-items-center">
             <Button variant="none" className={`${classes.dropdownItem} border rounded mt mt-4`} onClick={()=>editProductTypePriceHandler(product)}>Edit Price</Button>
               </div>     
              </td>
            </tr>
            ))
          }         
          </tbody>
        </Table>
      </div>
      <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Product type price</Modal.Title>
      </Modal.Header>
      <Modal.Body>
     <div className="p-3">
     <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Enter product type price here (price/Kg)</Form.Label>
        <Form.Control
         type="text"
         onChange={priceChangeHandler}
         value={price}
         className={error?classes.errorBorder:''}
          />
          <span className={classes.errorText}>{error}</span>
      </Form.Group>
      <div className="d-flex justify-content-end my-3">
      <CancelButton title='Cancel' onClose={handleClose}/>
      <div className="ms-4">
      <SaveButton title='Save' onSave={saveProductTypePrice} />
      </div>
      
     
      </div> 
     </div>
      </Modal.Body>
    
    </Modal>
    </div>
  );
};
export default ProductDetail;

import {Fragment,useState,useEffect} from 'react'
import Form from 'react-bootstrap/Form'
import Modal from "react-bootstrap/Modal";
import CancelButton from "../../components/CancelButton";
import SaveButton from '../../components/Button'
import validateProduct from './validateProduct'
import NotificationModal from '../../components/NotificationModal';
import {buttonAction} from '../../store/slices/ButtonSpinerSlice'
import {useDispatch } from "react-redux";
// import { productAction } from '../../store/slices/ProductSlice';
import apiClient from '../../url'
import classes from './Products.module.css'

const EditFarmerProduct = ({show,product,onClose}) =>{
  const [products,setProducts] = useState([])
  const [types,setTypes] =useState([])
 const [productInfo,setProductInfo] =useState({productId:"",productTypeId:"",quality:"Fresh",quantity:"",warehousePosition:''})
 const [errors,setErrors] = useState({productId:"",productTypeId:"",quality:"",quantity:"",warehousePosition:'',farmer:''})
 const[modalData,setModalData] = useState({show:false,status:null,title:'',message:''})
 const dispatch = useDispatch()
 
 const fetchProducts = async()=>{
 const response = await apiClient.get('localadmin/products/for-filter')
 if(response.status === 200){
  setProducts(response.data)
  setTypes(response.data[0]?.productTypes)
 
 }
 }

 useEffect(()=>{
  fetchProducts()
  const productToBeEdited = {
    productId:product.productId,
    productTypeId:product.productTypeId,
    quality:product.quality,
    quantity:product.currentQuantity,
    warehousePosition:product.warehousePosition
  }
  setProductInfo(productToBeEdited)

 },[product])
 const onChangeHandler = (e) =>{
  const {name,value} = e.target
  setProductInfo(preValue=>{
    return {...preValue,[name]:value}
  })
  if(value){
    setErrors(prevErrors=>{
      return {...prevErrors,[name]:''}
    })
  }
 }
 const productSelectChangeHandler = (e) =>{
  const {name,value} = e.target
  const index=products.findIndex(product=>product.id*1 === e.target.value*1)
  setTypes(products[index].productTypes)
  setProductInfo(preValue=>{
    return {...preValue,[name]:value,productTypeId:products[index].productTypes[0]?.id}
  })
  if(value){
    setErrors(prevErrors=>{
      return {...prevErrors,[name]:''}
    })
  }
 }
 const selectChangeHandler = (e)=>{
  const {name,value} = e.target
  setProductInfo(preValue=>{
    return {...preValue,[name]:value}
  })
  if(value){
    setErrors(prevErrors=>{
      return {...prevErrors,[name]:''}
    })
  }
 }
 const saveHandler = async() =>{
  const editedProduct = {
          coldRoomId:product.coldRoomId,
          farmerId:product.farmerId,
          ...productInfo
  }
  const err = validateProduct(productInfo)

  setErrors(err)
  if(Object.values(err).length === 0){
    try{
      dispatch(buttonAction.setBtnSpiner(true))
      const response = await apiClient.put(`localadmin/products/${product.id}`,editedProduct)
      if(response.status === 200){
        // dispatch(productAction.editFarmerProduct())
        onClose()
        setModalData({show:true,status:1,title:'Successful',message:'You edited product information successfully'})
      }
    }
    catch(err){
      setModalData({show:true,status:0,title:'Faild',message:'faild to edit product information'})
    }
    finally{
      dispatch(buttonAction.setBtnSpiner(false))
    }

  }
 }
 const closeEditModal = ()=>{
  onClose()
 }
 const handleModalClose =() =>{
  setModalData({})
}
    return<Fragment>
    <Modal
    size={"lg"}
    show={show}
    onHide={closeEditModal}
    backdrop="static"
    keyboard={false}
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title>Edit Product Information</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <div className="fw-bold py-2">Product Information</div>
    <div className="border border-2 rounded-3 shadow-sm p-4">
   <div className='d-flex'>
   <Form.Group className="mb-3 flex-fill me-5" controlId="product">
     <Form.Label>Select Product</Form.Label>
     <Form.Select 
     name='productId'
     className={errors.productId?classes.errorBorder:''}
     onChange={productSelectChangeHandler}
     value={productInfo.productId || ''} >
     {
       products?.length >0 && (
         products.map(product=>(<option key={product.id} value={product.id}>{product.name}</option>))
       )}
   </Form.Select>
   <span className={classes.errorText}>{errors.productId}</span>
   </Form.Group> 
   <Form.Group className="mb-3 flex-fill me-5" controlId="type">
   <Form.Label>Select Product Type</Form.Label>
   <Form.Select
   name='productTypeId'
    className={errors.productTypeId?classes.errorBorder:''}
    onChange={selectChangeHandler}
     value={productInfo.productTypeId || ''}
    >
    {
     types?.length > 0 && (
       types.map(type=>(<option key={type.id} value={type.id}>{type.title}</option>))
     )}
 </Form.Select>
 <span className={classes.errorText}>{errors.type}</span>
 </Form.Group> 
 <Form.Group className="mb-3 flex-fill" controlId="product">
 <Form.Label>Select Product Quality</Form.Label>
 <Form.Select 
 name='quality'
 className={errors.quality?classes.errorBorder:''}
 onChange={selectChangeHandler}
 value={productInfo.quality || ''}
 >
 <option value='Fresh'>Fresh</option>
 <option value='Nutritive'>nutritive </option>
 <option value='Flavor'>flavor </option>
</Form.Select>
<span className={classes.errorText}>{errors.quality}</span>
</Form.Group> 
   
 </div>
 <div className='d-flex justify-content-start align-items-center mt-4'>
 <Form.Group className="mb-3 me-5 col-4" controlId="priceinput">
   <Form.Label>Quantity In Kg</Form.Label>
   <Form.Control
   type='number'
   name='quantity'
   onChange={onChangeHandler}
   value={productInfo.quantity || ''}
   className={errors.quantity?classes.errorBorder:''}
  />
  <span className={classes.errorText}>{errors.quantity}</span>
 </Form.Group> 
 <Form.Group className="mb-3 me-5 col-4" controlId="position">
 <Form.Label>Product SKU</Form.Label>
 <Form.Control
 type='text'
 name='warehousePosition'
 onChange={onChangeHandler}
 value={productInfo.warehousePosition || ''}
 className={errors.warehousePosition?classes.errorBorder:''}
/>
<span className={classes.errorText}>{errors.warehousePosition}</span>
</Form.Group>      
</div>
    </div>
    </Modal.Body>
    <Modal.Footer>
      <CancelButton title="Cancel" onClose={closeEditModal} />
      <SaveButton title="Save" onSave={saveHandler} />
    </Modal.Footer>
  </Modal>
  <NotificationModal modal={modalData} onClose={handleModalClose} />
    </Fragment>
}
export default EditFarmerProduct
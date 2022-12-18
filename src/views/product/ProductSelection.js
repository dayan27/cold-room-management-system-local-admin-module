import {Fragment,useState,useEffect} from 'react'
import Form from 'react-bootstrap/Form'
import validateProduct from './validateProduct'
import SaveButton from '../../components/Button'
import NotificationModal from '../../components/NotificationModal'
import {buttonAction} from '../../store/slices/ButtonSpinerSlice'
import { useDispatch,useSelector } from 'react-redux'
import apiClient from '../../url'
import classes from './Products.module.css'
const ProductSelection = (props) =>{
  const user = useSelector(state=>state.user.data)
  const [products,setProducts] = useState([])
  const [types,setTypes] =useState([])
 const [productInfo,setProductInfo] =useState({productId:"",productTypeId:"",quality:"",quantity:"",warehousePosition:''})
 const [errors,setErrors] = useState({productId:"",productTypeId:"",quality:"",quantity:"",warehousePosition:'',farmer:''})
 const[modalData,setModalData] = useState({show:false,status:null,title:'',message:''})
 const dispatch = useDispatch()
 const {farmerId} =  props

 const fetchProducts = async()=>{
 const response = await apiClient.get('localadmin/products/for-filter')
 if(response.status === 200){
  setProducts(response.data)
  setTypes(response.data[0]?.productTypes)
  setProductInfo(prevValues=>{
    return {...prevValues,productId:response.data[0]?.id,productTypeId:response.data[0]?.productTypes[0]?.id}
  })
 }
 }

 useEffect(()=>{
  fetchProducts()
 },[])
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
    const saveHandler = async()=>{
      const productData = {}
      let err = validateProduct(productInfo) 
        setErrors(err)
        if(!props.isNewFarmer && !props.farmerId){
          setErrors(prevErr=>{
            return {...prevErr,farmer:'please search and select farmer'}
            
          })
          err.farmer = "please search and select farmer"
        }
        let error = Object.values(err)?.length
        let farmerInfo ={}
        let response = null
      if(props?.isNewFarmer){
         farmerInfo =props.getFarmer()            
         const farmer = {
          fName:farmerInfo.farmer.fName,
          lName:farmerInfo.farmer.lName,
          phoneNumber:farmerInfo.farmer.phoneNumber,          
          address:{
            region:farmerInfo.farmer.region,
            zone:farmerInfo.farmer.zone,
            woreda:farmerInfo.farmer.woreda,
            kebele:farmerInfo.farmer.kebele
           }
         }
         productData.addedBy=(user.fName+' '+user.lName)
          productData.isNew = true
          productData.farmer = farmer
          productData.product = productInfo  
          productData.coldRoomId = user.coldRoom.id

      }
      else if(!props.isNewFarmer){
        productData.addedBy=(user.fName+' '+user.lName)
        productData.isNew = false
        productData.farmerId =props.farmerId
        productData.product = productInfo
        productData.coldRoomId = user.coldRoom.id

      }
      if(!error && !farmerInfo.error ){         
        try{
          dispatch(buttonAction.setBtnSpiner(true));
        response = await apiClient.post('localadmin/products',productData)
        if(response.status === 200 || 201){
          setModalData({show:true,status:1,title:'Successful',message:'You added a product successfully'})
          setProductInfo(prevValue=>{
            return {...prevValue,quantity:'',warehousePosition:''}
          })
          if(props?.isNewFarmer){
            props.setFarmer({})
          }
          
        }
        }
        catch(err){
          setModalData({show:true,status:0,title:'Faild',message:'faild to add product'})
        }
        finally{
          dispatch(buttonAction.setBtnSpiner(false));
        }
      }
      
    }
    const handleModalClose =() =>{
      setModalData({})
    }
    return<Fragment>
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
    <Form.Group className="mb-3 flex-fill" controlId="quality">
    <Form.Label>Product Quality</Form.Label>
    <Form.Control 
    name='quality'
    placeholder='ex. Fresh'
    className={errors.quality?classes.errorBorder:''}
    onChange={onChangeHandler}
    value={productInfo.quality || ''}
    />
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
  {!farmerId &&(
  <div className={`${classes.errorText} my-3 text-center`}>{errors.farmer}</div>
  )}
       </div>
       <div className='d-flex justify-content-end ms-auto mt-4'>
   <SaveButton title="Save" onSave={saveHandler} />
    </div>
    <NotificationModal modal={modalData} onClose={handleModalClose} />
    </Fragment>
}
export default ProductSelection
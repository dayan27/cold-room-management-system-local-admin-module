import {useState} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ProductSelection from './ProductSelection'
import validateFarmer from './validateFarmer'
import classes from './Products.module.css'
import { useNavigate } from 'react-router-dom'
const AddProductNewCustomer = () =>{
    const [farmer,setFarmer] = useState({fName:'',lName:'',region:'',zone:'',woreda:'',kebele:'',phoneNumber:''})
    const [errors,setErrors] = useState({})
    const navigate = useNavigate()
    const addExistingCustomerProduct = () =>{
        navigate('/products/add-product')
    }
    const changeHandler = (e)=>{
        const {name,value}= e.target
        setFarmer(prevValues=>{
            return {...prevValues,[name]:value}
        })
        if(value){
            setErrors(preErrors=>{
                return {...preErrors,[name]:''}
            })
        }
    }
    const getFarmer = () =>{
        const err = validateFarmer(farmer)
        setErrors(err)
        const error = Object.values(err)?.length
        return {error,farmer}
    }
    return <>
    <div className='d-flex mt-2'>
    <div className="fw-bold py-2 me-5">Farmer Information</div>
   <div> <Button variant='none' className={`${classes.viewHistoryBtn} ms-5 px-4 py-1`} onClick={addExistingCustomerProduct}>Existing Farmer</Button></div>
    </div>
    <div className="border border-2 rounded-3 shadow-sm p-4 mt-3 mb-4">
   <div className='d-flex'>
   <Form.Group className="mb-3 flex-fill me-5" controlId="fname">
     <Form.Label>First Name</Form.Label>
     <Form.Control
     type='text'
     placeholder='enter first name'
     onChange={changeHandler}
     name='fName'
     value={farmer.fName || ''}
     className={errors.fName?classes.errorBorder:''}
    />
    <span className={classes.errorText}>{errors.fName}</span>
   </Form.Group> 
   <Form.Group className="mb-3 flex-fill me-5" controlId="lname">
   <Form.Label>Last Name</Form.Label>
   <Form.Control
   type='text'
   placeholder='enter last name'
   onChange={changeHandler}
     name='lName'
     value={farmer.lName || ''}
     className={errors.lName?classes.errorBorder:''}
    />
    <span className={classes.errorText}>{errors.lName}</span>
 </Form.Group> 
 <Form.Group className="mb-3 flex-fill" controlId="region">
 <Form.Label>Region</Form.Label>
 <Form.Control
 type='text'
 placeholder='residence region'
 onChange={changeHandler}
     name='region'
     value={farmer.region || ''}
     className={errors.region?classes.errorBorder:''}
     />
     <span className={classes.errorText}>{errors.region}</span>
</Form.Group>    
 </div>
 <div className='d-flex  mt-4'>
 <Form.Group className="mb-3 flex-fill me-5" controlId="zone">
   <Form.Label>Zone</Form.Label>
   <Form.Control
   type='text'
   placeholder='residence zone'
   onChange={changeHandler}
     name='zone'
     value={farmer.zone || ''}
     className={errors.zone?classes.errorBorder:''}
    />
    <span className={classes.errorText}>{errors.zone}</span>
 </Form.Group> 
 <Form.Group className="mb-3 flex-fill me-5" controlId="woreda">
 <Form.Label>Woreda</Form.Label>
 <Form.Control
 type='text'
 placeholder='residence woreda'
 onChange={changeHandler}
     name='woreda'
     value={farmer.woreda || ''}
     className={errors.woreda?classes.errorBorder:''}
     />
     <span className={classes.errorText}>{errors.woreda}</span>
</Form.Group> 
<Form.Group className="mb-3 flex-fill" controlId="kebele">
 <Form.Label>Kebele</Form.Label>
 <Form.Control
 type='text'
 placeholder='residence kebele'
 onChange={changeHandler}
     name='kebele'
     value={farmer.kebele || ''}
     className={errors.kebele?classes.errorBorder:''}
     />
     <span className={classes.errorText}>{errors.kebele}</span>
</Form.Group>  
</div>
<Form.Group className="mb-3 w-25" controlId="phone">
 <Form.Label>Phone Number</Form.Label>
 <Form.Control
 type='tel'
 placeholder='enter phone number'
 onChange={changeHandler}
     name='phoneNumber'
     value={farmer.phoneNumber || ''}
     className={errors.phoneNumber?classes.errorBorder:''}
     />
     <span className={classes.errorText}>{errors.phoneNumber}</span>
</Form.Group> 
    </div>
    <ProductSelection isNewFarmer={true} farmerId="" getFarmer={getFarmer} setFarmer={setFarmer} />
    
 </>

}
export default AddProductNewCustomer
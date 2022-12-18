import {useState} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userAction } from '../../store/slices/UserSlice';
import { useNavigate,useSearchParams } from 'react-router-dom';
import classes from './Login.module.css'
import apiClient from '../../url';
const ForgotPassword = () =>{
 const [cridentials, setCridentials] = useState({password:'',confirmpassword:''})
 const [errors,setErrors] = useState({password:'',confirmpassword:''})
 const dispatch = useDispatch()
 const navigate = useNavigate()
 // eslint-disable-next-line no-unused-vars
 const [query,setQuery] = useSearchParams()
     const changeHandler = (e) =>{
        const {name,value} = e.target
        setCridentials(prevValues=>{
            return {...prevValues,[name]:value}
        })
     }
     const validate = (values) =>{
      const errorValues ={}
      if(!values.password){
        errorValues.password = 'new password is required'
      }
      else if(values.length > 10){
        errorValues.password = 'password must not be greater than 10 characters'
      }
      if(values.length < 6){
        errorValues.password = 'password must not be lessthan 6 characters'
      }
      if(!values.confirmpassword){
        errorValues.confirmpassword ='please confirm new password'
      }
      else if(values.password !== values.confirmpassword){
        errorValues.confirmpassword = 'password is not match'
      }
      
      return errorValues
     }
     const fetchUserData = async(data) =>{
      try{
       const response = await apiClient.get('localadmin/auth/my-account')
       if(response.status === 200){
        dispatch(userAction.setUser(response.data))
        navigate('/')
     }
      }
      catch(err){
        console.log('error')
      }
     }
    const saveNewPassword =async() =>{
      const error = validate(cridentials)
        setErrors(error)
        if(Object.values(error).length === 0){
          try{
            const response = await apiClient.post('admin/auth/reset-password',{newPassword:cridentials.password,email:query.get('email')})
            if(response.status === 200 || 201){
              fetchUserData()
            }
          }
          catch(err){}
        }
      }
    return <div className={`${classes.wraper} p-5`}>
<Form>
<Form.Group className="mb-4" controlId="loginemail">
  <Form.Label className='fw-bold'>New Password</Form.Label>
  <Form.Control 
  type="password" 
  name='password'
  className={errors.email?classes.errorBorder:''}
  onChange={changeHandler}
   />
   <span className={classes.errorText}>{errors.email}</span> 
</Form.Group>
<Form.Group className="mb-4" controlId="password">
  <Form.Label className='fw-bold'>Confirm Password</Form.Label>
  <Form.Control 
  type="password"
  name='confirmpassword'
  className={errors.confirmpassword?classes.errorBorder:''}
  onChange={changeHandler}
   />
   <span className={classes.errorText}>{errors.confirmpassword}</span> 
</Form.Group>
<Button className={`${classes.btn} w-100`} variant='none' onClick={saveNewPassword}>Save Password</Button>
</Form>
<div className='d-flex justify-content-end mt-4'>
<Link to={'/login'}>Login</Link>
</div>
</div>
}
export default ForgotPassword
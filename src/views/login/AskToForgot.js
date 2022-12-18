import {useState} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { Link, useNavigate} from 'react-router-dom';
import { buttonAction } from '../../store/slices/ButtonSpinerSlice';
import { useDispatch } from 'react-redux';
import apiClient from '../../url';
import classes from './Login.module.css'
const AskToForgot = () =>{
   const [toggleForm,setToggleForm] = useState(true)
 const [email, setEmail] = useState('')
 const [code,setCode] = useState(null)
 const [error,setError] = useState('')
 const [notification,setNotification]=useState({})
 const dispatch = useDispatch()
 const navigate = useNavigate()
     const emailChangeHandler = (e) =>{
        setEmail(e.target.value)
        if(e.target.value){
            setError('')
        }
     }
     const validate = (value) =>{
        const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
      let err = ''
      if(!value?.trim()){
        err = 'email is required'
      }
      else if(!regexExp.test(value)){
        err = 'invalid email address'
      }
      return err
     }
     const toggleFormHandler = () =>{
      setToggleForm(true)
      setNotification({})
     }
    const sendEmailHandler = async() =>{
       const err = validate(email)
        setError(err)
        if(!err){
     try{
        dispatch(buttonAction.setBtnSpiner(true))
        const response = await apiClient.post('admin/auth/forgot-password',{email:email})
        if(response.status === 200){
         setToggleForm(false)
            setNotification({status:'success',message:'We have sent you confirmation code to your email,Please enter the code'})
        }
     }
     catch(err){
        setNotification({status:'fail',message:err.response.data})
     }
     finally{
        dispatch(buttonAction.setBtnSpiner(false))
     }
        }
    }
    const codeChangeHandler =(e) =>{
      setCode(e.target.value)
    }
    const sendCodeHandler = async() =>{
      let err = ''
      if(!code){err = 'please inter the code we sent to your email address'}
      else if(code?.length !== 6){err = 'incorrect code'}
      setError(err)
      if(!err){
         try{
            dispatch(buttonAction.setBtnSpiner(true))
            const response = await apiClient.post('admin/auth/verify-token',{tokenCode:code,email:email})
            if(response.status === 200 || 201){
               localStorage.removeItem('token')
               apiClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
               localStorage.setItem("token", response.data.token);
               navigate(`/forgot-password?email=${email}`)
            }
         }
         catch(err){
            setNotification({status:'fail',message:err.response.data})
         }
         finally{
            dispatch(buttonAction.setBtnSpiner(false))
         }
    }
   }
    return <div className={`${classes.wraper} p-5`}>
<Form>
{toggleForm && (
   <div>
<Form.Group className="mb-4" controlId="loginemail">
  <Form.Label className='fw-bold'>Email address</Form.Label>
  <Form.Control 
  type="email" 
  placeholder="name@example.com"
  name='email'
  className={error?classes.errorBorder:''}
  onChange={emailChangeHandler}
   />
   <span className={classes.errorText}>{error}</span> 
</Form.Group>
<Button className={`${classes.btn} w-100 py-1`} variant='none' onClick={sendEmailHandler}>Forgot password</Button>
</div>
)}
{
   !toggleForm && (
      <div>
      <Button onClick={toggleFormHandler} variant='none' className={`${classes.boxShadow} fs-3 fw-bold`}><i className="fas fa-arrow-left"></i></Button> 
<Form.Group className="mb-4 mt-3" controlId="loginemail">
  <Form.Label className='fw-bold'>Enter Confirmation Code</Form.Label>
  <Form.Control 
  type="number" 
  name='code'
  className={error?classes.errorBorder:''}
  onChange={codeChangeHandler}
   />
   <span className={classes.errorText}>{error}</span> 
</Form.Group>
<Button className={`${classes.btn} w-100 py-1`} variant='none' onClick={sendCodeHandler}>Send Code</Button>
</div>
   )
}
</Form>
<div className={`${notification.status==='success'?"text-success":classes.errorText} my-2 text-center `}>{notification.message}</div>
<div className='d-flex justify-content-end mt-4'>
<Link to={`/login`}>Login</Link>
</div>
</div>
}
export default AskToForgot
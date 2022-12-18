import {useState} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Spinner from "react-bootstrap/Spinner";
import { useSelector,useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import {buttonAction} from '../../store/slices/ButtonSpinerSlice'
import { userAction } from '../../store/slices/UserSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../../url/index';
import classes from './Login.module.css'


const LoginPage = () =>{
    const isLoading = useSelector((state) => state.btn.isLoading);
    const [cridentials, setCridentials] = useState({email:'',password:''})
    const [errors,setErrors] = useState({email:'',password:'',errNotify:''})
    const dispatch = useDispatch()
    const navigate = useNavigate()
        const changeHandler = (e) =>{
           const {name,value} = e.target
           setCridentials(prevValues=>{
               return {...prevValues,[name]:value}
           })
           if(e.target.value){
            setErrors(prevErrors=>{
                return {...prevErrors,[name]:''}
            })
           }
        }
        const validate = (values) =>{
           const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
         const errorValues ={}
         if(!values.email.trim()){
           errorValues.email = 'email is required'
         }
         else if(!regexExp.test(values.email)){
           errorValues.email = 'invalid email address'
         }
         if(!values.password){
           errorValues.password ='password is required'
         }
         else if(values.length > 15){
           errorValues.password = 'password must not be greater than 15 characters'
         }
         return errorValues
        } 
        const fetchUserData = async(data) =>{
          try{
           const response = await axios.get('https://coldroomapinew.rensysengineering.com/localadmin/auth/my-account',{
            headers: {
              'Access-Control-Allow-Origin': '*',
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization:`Bearer ${data.token}`,    
      
          }
           })
           if(response.status === 200){
            dispatch(userAction.setUser(response.data))
            navigate('/')
         }
          }
          catch(err){
            console.log('error')
          }
         }
        const saveUserData = (data) =>{
            apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
              localStorage.setItem("token", data.token);
              dispatch(userAction.setToken(data.token))
              dispatch(userAction.setIsAuthenticated(true))
        }
        const loginHandler = async() =>{
            setErrors(validate(cridentials))
            if(!errors.email && !errors.password){
                dispatch(buttonAction.setBtnSpiner(true))
                try{
                    var response = await apiClient.post('admin/auth/local-login',cridentials)
                    if(response.status === 200 || 201){
                        saveUserData(response.data)
                        fetchUserData(response.data)
                    }
                }
                catch(err){
                    setErrors(prevErrors=>{
                        return {...prevErrors,errNotify:err.response.data}
                    })
                }
                finally{
                    dispatch(buttonAction.setBtnSpiner(false))
                }
            }
        }
     return <div className={`${classes.wraper} p-5`}>
    <div className='d-flex justify-content-center fs-3 fw-bold mb-5'>
    <span className={classes.yellowTxt}>RENSYS</span>
    <span className={classes.greenTxt}>ENGINEERING</span>
    </div>
<Form>
<Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
  <Form.Label className='fw-bold'>Email address</Form.Label>
  <Form.Control
   type="email"
    name='email'
    className={errors.email?classes.errorBorder:''}
    onChange={changeHandler}
     />
     <span className={classes.errorText}>{errors.email}</span> 
</Form.Group>
<Form.Group className="mb-4" controlId="exampleForm.ControlTextarea1">
  <Form.Label className='fw-bold'>Password</Form.Label>
  <Form.Control
   type="password"
   name='password'
   className={errors.password?classes.errorBorder:''}
   onChange={changeHandler}
    />
    <span className={classes.errorText}>{errors.password}</span> 
</Form.Group>
<Button className={`${classes.btn} w-100`} variant='none' onClick={loginHandler}>
Login  <span className="ms-2">
{isLoading && <Spinner animation="border" variant="light" size='sm' />}
</span>
</Button>
</Form>
<p className={`${classes.errorText} mt-3`}>{errors.errNotify}</p>
<div className='d-flex justify-content-end mt-4'>
<Link to={'/forgot'}>Forgot Password</Link>
</div>
</div>
}
export default LoginPage
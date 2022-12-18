import {useEffect} from 'react'
import {useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from './url/index';
import Router from './routes';
import { userAction } from './store/slices/UserSlice';
import './App.css';

function App() {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fetchUserData = async(token) =>{
    try{
     const response = await axios.get('https://coldroomapinew.rensysengineering.com/localadmin/auth/my-account',{
      headers: {
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:`Bearer ${token}`,    

    }
     })
     if(response.status === 200){
      dispatch(userAction.setUser(response.data))
   }
    }
    catch(err){
      console.log('error')
    }
   }
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(token){
      dispatch(userAction.setToken(token))
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserData(token)
    }
   
    else{
      navigate('/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (<Router />);
}

export default App;

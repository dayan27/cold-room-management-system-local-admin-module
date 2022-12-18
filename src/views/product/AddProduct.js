import React from 'react'
import { Outlet } from "react-router-dom"
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import classes from './Products.module.css'
const AddProduct = () =>{
    const navigate = useNavigate()
   return <React.Fragment>
   <Button onClick={()=>navigate(-1)} variant='none' className={`${classes.boxShadow} fs-3 fw-bold`}><i className="fas fa-arrow-left"></i></Button> 
   <div className='ms-2 fs-5 fw-bold'>Add Product</div>
        <Outlet />
   </React.Fragment>
    
}
export default AddProduct

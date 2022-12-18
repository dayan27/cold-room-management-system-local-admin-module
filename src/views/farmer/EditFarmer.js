import {useState,useEffect} from 'react'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import SaveButton from '../../components/Button';
import CancelButton from '../../components/CancelButton';
import validateFarmer from './validatFarmer';
import apiClient from '../../url/index';
import { buttonAction } from '../../store/slices/ButtonSpinerSlice';
import { farmerAction } from '../../store/slices/FarmerSlice';
import { useDispatch } from 'react-redux';
import classes from './Farmers.module.css'


const EditFarmer = ({show,farmer,onClose}) => {
    const [farmerInfo,setFarmerInfo] = useState({fName:'',lName:'',region:'',zone:'',woreda:'',kebele:'',phoneNumber:'',addressId:null,})
    const [errors,setErrors] = useState({fName:'',lName:'',region:'',zone:'',woreda:'',kebele:'',phoneNumber:''})
    const dispatch = useDispatch()
    console.log('farmer to be edited=',farmer)
 useEffect(()=>{
  const oldFarmerInfo={
    fName:farmer.fName,
    lName:farmer.lName,
    addressId:farmer.address?.id,
    region:farmer.address?.region,
    zone:farmer.address?.zone,
    woreda:farmer.address?.woreda,
    kebele:farmer.address?.kebele,
    phoneNumber:farmer?.phoneNumber
  }
  setFarmerInfo(oldFarmerInfo)
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[farmer])
 
    const changeHandler = (e) =>{
       const {name,value} = e.target
       setFarmerInfo(previousValues=>{
        return {...previousValues,[name]:value}
       })
       if(e.target.value){
        setErrors(prevErrors=>{
            return {...prevErrors,[name]:""}
        })
       }
    }
    const editHandler = async() =>{
      const err =validateFarmer(farmerInfo)
      setErrors(err)
      if(Object.values(err)?.length === 0){
      dispatch(buttonAction.setBtnSpiner(true))
      try{
      const response = await apiClient.put(`localadmin/farmers/${farmer.id}`,farmerInfo)
      if(response.status === 200){
        const newFarme = {
              id:farmer.id,
              fName:farmerInfo.fName,
              lName:farmerInfo.lName,
              phoneNumber:farmerInfo.phoneNumber,
              totalProduct:farmer.totalProduct,
              totalBalance:farmer.totalBalance,
              totalRent:farmer.totalRent,
              address:{
                id:farmer.address.id,
                region:farmerInfo.region,
                zone:farmerInfo.zone,
                woreda:farmerInfo.woreda,
                kebele:farmerInfo.kebele,
              }
        }
         dispatch(farmerAction.editFarmer(newFarme))
         handleClose()
      }
    }
    catch(er){}
    finally{
      dispatch(buttonAction.setBtnSpiner(false))
    }

      console.log('employee save is clicked')
    }
  }
  const handleClose = () => {
    onClose()
    setFarmerInfo({})
      setErrors({})
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Farmer Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form className='px-3'>
        <Form.Group className="mb-3" controlId="fName">
          <Form.Label>First Name</Form.Label>
          <Form.Control 
          type="text"
          name="fName"
          onChange={changeHandler}
          value={farmerInfo.fName || ''}
          className={errors.fName?classes.errorBorder:''}
           />
           <span className={classes.errorText}>{errors.fName}</span> 
        </Form.Group>
        <Form.Group className="mb-3" controlId="lname">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
           type="text"
           name="lName"
          onChange={changeHandler}
          value={farmerInfo.lName || ''}
          className={errors.lName?classes.errorBorder:''}
            />
            <span className={classes.errorText}>{errors.lName}</span> 
        </Form.Group>
        <Form.Group className="mb-3" controlId="phoneNo">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
         type="number"
         name="phoneNumber"
          onChange={changeHandler}
          value={farmerInfo.phoneNumber || ''}
          className={errors.phoneNumber?classes.errorBorder:''}
          />
          <span className={classes.errorText}>{errors.phoneNumber}</span> 
      </Form.Group>
      <Form.Group className="mb-3" controlId="Region">
      <Form.Label>Region</Form.Label>
      <Form.Control
       type="text"
       name="region"
       onChange={changeHandler}
       value={farmerInfo.region || ''}
       className={errors.region?classes.errorBorder:''}
        />
        <span className={classes.errorText}>{errors.region}</span> 
    </Form.Group>
    <Form.Group className="mb-3" controlId="zone">
    <Form.Label>Zone</Form.Label>
    <Form.Control
     type="text"
     name="zone"
     onChange={changeHandler}
     value={farmerInfo.zone || ''}
     className={errors.zone?classes.errorBorder:''}
      />
      <span className={classes.errorText}>{errors.zone}</span> 
  </Form.Group>
  <Form.Group className="mb-3" controlId="Woreda">
  <Form.Label>Woreda</Form.Label>
  <Form.Control
   type="text"
   name="woreda"
   onChange={changeHandler}
   value={farmerInfo.woreda || ''}
   className={errors.woreda?classes.errorBorder:''}
    />
    <span className={classes.errorText}>{errors.woreda}</span> 
</Form.Group>
<Form.Group className="mb-3" controlId="Kebele">
<Form.Label>Kebele</Form.Label>
<Form.Control
 type="text"
 name="kebele"
 onChange={changeHandler}
 value={farmerInfo.kebele || ''}
 className={errors.kebele?classes.errorBorder:''}
  />
  <span className={classes.errorText}>{errors.kebele}</span> 
</Form.Group>
      </Form>
  
        </Modal.Body>
        <Modal.Footer>
     <CancelButton title="Close" onClose={handleClose} />
      <SaveButton title="Save Change" onSave={editHandler}/>)
      
       
        </Modal.Footer>
      </Modal>
    </>
  );
}

 export default EditFarmer 
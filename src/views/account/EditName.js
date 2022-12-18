import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import SaveButton from '../../components/Button';
import CancelButton from '../../components/CancelButton';
import { buttonAction } from "../../store/slices/ButtonSpinerSlice";
import {userAction} from '../../store/slices/UserSlice'
import { useDispatch } from 'react-redux';
import classes from './Account.module.css'
import apiClient from '../../url';

 const EditName = (props) => {
    const [values,setValues] =useState({fName:'',lName:''})
    const [errors,setErrors] = useState({fName:'',lName:''})
    const dispatch = useDispatch()
    const changeHandler = (e) =>{
        const {name,value} =e.target
        setValues(prevValues=>{
            return {...prevValues,[name]:value}
        })
        if(e.target.value){
            setErrors(preErr=>{
                return {...preErr,[name]:''}
            })
        }
    }
    const validate = (data) =>{
        const err = {}
        if(!data.fName?.trim()){
            err.fName = 'first name is requried'
        }    
     else if(data.fName.trim().length >15){
        err.fName = 'first name must be lessthan or equal to 15 letters'
    }
    if(!data.lName?.trim()){
        err.lName = 'last name is requried'
    }    
 else if(data.lName.trim().length >15){
    err.lName = 'last name must be lessthan or equal to 15 letters'
}
return err
}
    const saveHandler = async() =>{
        setErrors(validate(values))
        if(!errors.fName && !errors.lName){
            try{
                dispatch(buttonAction.setBtnSpiner(true));
                const response = await apiClient.put('admin/editAdminName',values)
                if(response.status === 200){
                    dispatch(userAction.editUser(response.data))
                }
            }
            catch(err){
                console.log('falid to edit name')
            }
            finally{
                dispatch(buttonAction.setBtnSpiner(false));
            }
        }
    }
    const closeHandler = () =>{
        props.onClose()
        setErrors({})
    }
  return (
    <Modal
      show={props.show}
      onHide={() => closeHandler(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="editNameModal">
          Edit Name
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form className='px-3'>
      <Form.Group className="mb-3" controlId="fName">
        <Form.Label>First Name</Form.Label>
        <Form.Control 
        type="text"
        name="fName"
        onChange={changeHandler}
        value={values.fName}
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
        value={values.lName}
        className={errors.lName?classes.errorBorder:''}
          />
          <span className={classes.errorText}>{errors.lName}</span> 
      </Form.Group>
      </Form>
        
      </Modal.Body>
      <Modal.Footer>
        <CancelButton title="Cancel" onClose={closeHandler} />
        <SaveButton title="Save Chance" onSave={saveHandler} />
      </Modal.Footer>
    </Modal>
  );
}
 
export default EditName
import {useState} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import EditName from './EditName'
import ChangePassword from './ChangePassword';
import myProf from '../../assetes/eyilachew.jpg'
import classes from './Account.module.css'


const Account = () =>{
    const [image,setImage] = useState('')
    const [showNameModal,setShowNameModal] = useState(false)
    const [showPasswordModal,setShowPasswordModal] = useState(false)
    let imgInput=null
        
        const fileChangeHandler=(e)=>{
            setImage(e.target.files[0])
        }
        const openEditNameModale = ()=>{
            setShowNameModal(true)
        }
        const openPasswordModal = () =>{
            setShowPasswordModal(true)
        }
       const closeNameModale = () =>{
        setShowNameModal(false)
       }
       const closePasswordModal =() =>{
        setShowPasswordModal(false)
       }
        
      
     return <>
     <div className={`${classes.wraper} pb-5 `}>
    <div className='d-flex justify-content-center fs-3 fw-bold mb-5 px-5 pt-3'>
        {!image && <div className='position-relative'>
        <img src={myProf} alt="my profile" className={`${classes.profileImg} img-fluid rounded-circle`} />
        <div className={`${classes.cameraIcon} fs-3`}>
        <span onClick={()=>imgInput.click()}><i className="fa-solid fa-camera"></i></span>
        <Form.Control
        type="file"
        className='d-none'
        ref={el=>imgInput=el}
        onChange={fileChangeHandler}
    />
        </div>
        </div>
     }
        {image &&  <div className='position-relative'>
        <img src={URL.createObjectURL(image)} alt="my profile" className={`${classes.profileImg} img-fluid rounded-circle`} />
        <div className={`${classes.cameraIcon} fs-3`}>
        <span onClick={()=>imgInput.click()}><i className="fa-solid fa-camera"></i></span>
        <Form.Control
        type="file"
        className='d-none'
        ref={el=>imgInput=el}
        onChange={fileChangeHandler}
    />
        </div>
        
        </div> 


        }
        
    </div>
    { image && <div className='text-center'>
        <Button variant='none' className={`${classes.btn} py-1`}>Save Profile picture</Button>
        </div>}
      <div className='d-flex border-bottom px-3'>
       <span>Name</span>
       <span className='ms-4'>Abera kebede</span>
       <span className={`${classes.editIcon} ms-auto`} onClick={openEditNameModale}><i className="fa-solid fa-pen-to-square"></i></span>
      </div>
      <div className={`${classes.editIcon} text-primary px-3 mt-4`} onClick={openPasswordModal}>Change Password</div>
</div>
<EditName show={showNameModal} onClose={closeNameModale} />
<ChangePassword show={showPasswordModal} onClose={closePasswordModal}/>
</>
}
export default Account
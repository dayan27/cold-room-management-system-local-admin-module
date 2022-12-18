import {useState,useEffect} from 'react'
import React from "react";
import SaveButton from "./Button";
import CancelButton from "./CancelButton";
import Modal from "react-bootstrap/Modal";


const ConfirmModal = (props) => {
  const [show,setShow] = useState(false)
  useEffect(()=>{
    setShow(props.show)
  },[props.show])
 const yesHandler = ()=>{
    props.onDelete()
    setShow(false)
 }
 
  const handleClose = () => {
    props.onClose(false);
    
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <div className="my-3">{props.message}</div>
        </Modal.Body>
        <Modal.Footer>
          <CancelButton title={"No"} onClose={handleClose} />
          <SaveButton title={"Yes"} onSave={yesHandler} />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmModal

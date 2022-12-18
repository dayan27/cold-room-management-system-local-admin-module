import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import classes from './NotificationModal.module.css'

const NotificationModal =({modal,onClose}) => {
  const handleClose = () => onClose();

  return <>
      <Modal
        show={modal.show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className={modal.status?classes.success:classes.fail}>{modal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`${modal.status?classes.success:classes.fail} my-2`}>{modal.message}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
}

export default NotificationModal
import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import classes from "./Button.module.css";

const ButtonCard = (props) => {
  const isLoading = useSelector((state) => state.btn.isLoading);
  const createColdRoomHandler = () => {
    props.onSave();
  };
  return (
    <Button onClick={createColdRoomHandler} className={`${classes.btn} px-3`}>
      <div className="d-flex align-items-center">
        <span>{props.title}</span>
        <span className="ms-2">
          {isLoading && <Spinner animation="border" variant="light" size='sm' />}
        </span>
      </div>
    </Button>
  );
};
export default React.memo(ButtonCard);

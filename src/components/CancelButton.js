import Button from 'react-bootstrap/Button';
import classes from './Button.module.css'

const CancelButton = (props) =>{
    const actionHandler = () =>{
props.onClose()
    }
 return <Button onClick={actionHandler} variant="none" className={classes.cancelBtn}>{props.title}</Button>
}
export default CancelButton
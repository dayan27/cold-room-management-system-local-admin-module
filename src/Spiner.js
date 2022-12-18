import Spinner from 'react-bootstrap/Spinner';
import classes from './Spiner.module.css'
const Spiner = () =>{
    return (
        <div className={classes.spinerContainer}>
        <div className='d-flex justify-content-center mt-5'>
        <Spinner animation="border" variant="info" />
        </div>
       
        </div>
    )
}
export default Spiner
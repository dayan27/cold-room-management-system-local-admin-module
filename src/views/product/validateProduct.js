const validateProduct = (values) =>{
    const error = {}

    if(!values.productId){
        error.productId = 'please select product'
    }
    if(!values.productTypeId){
        error.productTypeId = 'please select product type'
    }
    if(!values?.quality){
        error.quality = 'please enter product quality'
    }
    else if(values.quality?.length > 14){
        error.quality = 'product quality must be lessthan 15 letters'
    }
    if(!values?.quantity){
        error.quantity = 'product quantity is required'
    }
    else if(values.quantity?.length >6){
        error.quantity = 'quantity must be lessthan 7 digits'
    }
    if(!values.warehousePosition?.trim()){
       error.warehousePosition = 'product SKU is required'
    }
    else if(values.warehousePosition?.trim()?.length > 5){
        error.warehousePosition = 'product SKU must be lessthan 6 characters'
    }
    return error
}
export default validateProduct
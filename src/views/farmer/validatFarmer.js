const validateFarmer = (values) =>{
    const error = {}
    if(!values.fName.trim()){
        error.fName = 'first name is required'
    }
    else if(values.fName?.length >15){
        error.fName = 'the maximum limit of first name is 15 letters'
    }
    if(!values.lName.trim()){
        error.lName = 'last name is required'
    }
    else if(values.lName?.length >15){
        error.lName = 'the maximum limit of last name is 15 letters'
    }
    if(!values.region.trim()){
        error.region = 'residence region is required'
    }
    else if(values.region?.length >25){
        error.region = 'the maximum limit of region name is 25 letters'
    }
    if(!values.zone.trim()){
        error.zone = 'residence zone is required'
    }
    else if(values.zone?.length >25){
        error.zone = 'the maximum limit of zone name is 25 letters'
    }
    if(!values.woreda.trim()){
        error.woreda = 'residence woreda is required'
    }
    else if(values.woreda?.length >25){
        error.woreda = 'the maximum limit of woreda name is 25 letters'
    }
    if(!values.kebele.trim()){
        error.kebele = 'residence kebele is required'
    }
    else if(values.kebele?.length >25){
        error.kebele = 'the maximum limit of kebele name is 25 letters'
    }
    if(!values.phoneNumber.trim()){
        error.phoneNumber = 'phoneNumber is required'
    }
    else if(!values.phoneNumber.match(/^\d{10}$/g)){
        error.phoneNumber = 'invalid phone number'
}
return error
}
export default validateFarmer
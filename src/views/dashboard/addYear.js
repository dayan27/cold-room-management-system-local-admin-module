const addYear = () =>{
    const years = [2018,2019]
    const currentYear = new Date().getFullYear()*1
    console.log('current year',currentYear)
    for(let year=2020;year<=currentYear;year++){
     years.push(year)
    }
    return years
}
export default addYear
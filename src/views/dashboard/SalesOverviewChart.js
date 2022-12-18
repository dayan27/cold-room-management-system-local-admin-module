import {useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Form from 'react-bootstrap/Form';
import apiClient from '../../url/index';
import addYear from './addYear';
    const data = [
        {
          "month": "Jan",
          "sales": 0,
        },
        {
         "month": "Feb",
          "sales": 0,
        },
        {
         "month": "Mar",
          "sales": 0,
        },
        {
         "month": "Apr",
          "sales": 0,
        },
        {
          "month": "May", 
          "sales": 0,
        },
        {
          "month": "Jun", 
          "sales": 0,
        },
        {
          "month": "Jul",          
          "sales": 0,        
        },
        {
            "month": "Aug",          
            "sales": 0,        
          },
          {
            "month": "Sep",          
            "sales": 0,        
          },
          {
            "month": "Oct",          
            "sales": 0,        
          },
          {
            "month": "Nov",          
            "sales": 0,        
          },
          {
            "month": "Dec",          
            "sales": 0,        
          }
      ]

const SalesOverviewChart = () =>{
  const [salesOverviews,setSalesOverview] = useState(data)
  const user = useSelector(state=>state.user.data)
  const currentYear = new Date().getFullYear()*1
  const [selectedValue,setSelectedValue] = useState(currentYear)
  const years = addYear()
  useEffect(()=>{
    const fetchCurrentYearOrders = async() =>{      
      try{
        const response  = await apiClient.get(`localadmin/dashboard/bar?year=${currentYear}&coldRoomId=${user.coldRoom.id}`)
        if(response.status === 200){
          const datas = response.data.map(month=>{
            return {month:month.month.slice(0,3),sales:month.count}
          })
          let results =salesOverviews.map(element1=>datas.find(element2=>element1.month===element2.month) || element1)
  
          setSalesOverview(results)
        }
      }
      catch(err){}
    }
    fetchCurrentYearOrders()
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user])
  const filterByYearHandler = async(e)=>{
    setSelectedValue(e.target.value)
    try{
      const response  = await apiClient.get(`localadmin/dashboard/bar?year=${e.target.value}&coldRoomId=${user.coldRoom.id}`)
      if(response.status === 200){
        const datas = response.data.map(month=>{
          return {month:month.month.slice(0,3),sales:month.count}
        })
        let results =salesOverviews.map(element1=>datas.find(element2=>element1.month===element2.month) || {month:element1.month,sales:0})
        setSalesOverview(results)
      
    }
    
    }
    catch(err){}
  }
    return (
      <>
      <div className='d-flex justify-content-between'>
      <div className='fw-bold fs-5 p-3'>Sales Overview</div>
      <div>
      <Form.Select onChange={filterByYearHandler} value={selectedValue}>
      {
        years.map(year =>{
         return (<option value={year} key={year}>Year {year}</option>)
        })
      }
 
</Form.Select>
      </div>
  </div>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          width={500}
          height={300}
          data={salesOverviews}
          margin={{
            top: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#FF7E00" />
        </LineChart>
      </ResponsiveContainer>
   
  </>
  );
}
export default SalesOverviewChart
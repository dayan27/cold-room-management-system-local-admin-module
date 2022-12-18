import axios from "axios";
let apiClient = axios.create({
    baseURL:'https://coldroomapinew.rensysengineering.com/',

})
apiClient.interceptors.request.use(config=> {
    config.headers={
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:`Bearer ${localStorage.getItem("token")}`
    }
    return config
})

export default apiClient
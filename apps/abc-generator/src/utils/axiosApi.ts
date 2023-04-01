import axios from 'axios'

const axiosApi = axios.create({
  baseURL: 'http://localhost:4000',
  // headers: {
  //   Authorization: 'Bearer ' + localStorage.getItem('token'),
  // },
  headers: {
    'Content-Type': 'application/json',
  },
})

export { axiosApi }

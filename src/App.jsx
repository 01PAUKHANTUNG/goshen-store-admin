import React, { useState } from 'react'
import Navbar from './component/Navbar'
import { Route, Routes } from 'react-router'
import AddProduct from './pages/addProduct'
import OrderList from './pages/OrderList'
import { ToastContainer } from 'react-toastify'
import Login from './pages/Login'


export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {
  const [token, setToken] = useState('')
  return (
    <div >
      <ToastContainer />
      {token === '' ? <Login setToken={setToken}/> : 
      <div>
       <Navbar />
        <Routes>
             <Route path='/' element={<AddProduct token={token}/>} />
             <Route path='/orderlist' element={<OrderList />} />
             
        </Routes>
        </div>
        }
    </div>
  )
}

export default App

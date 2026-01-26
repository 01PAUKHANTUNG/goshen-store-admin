import React, { useState } from 'react'
import Navbar from './component/Navbar.jsx'
import { Route, Routes } from 'react-router'
import AddProduct from './pages/AddProduct.jsx'
import OrderList from './pages/OrderList.jsx'
import Users from './pages/Users.jsx'
import ContactMessages from './pages/ContactMessages.jsx'

import Login from './pages/Login.jsx'


import { backendUrl } from './config.js'

const App = () => {
  const [token, setToken] = useState('')

  return (
    <div >

      {token === '' ? <Login setToken={setToken} /> :
        <div>
          <Navbar />
          <Routes>
            <Route path='/' element={<AddProduct token={token} />} />
            <Route path='/orderlist' element={<OrderList token={token} />} />
            <Route path='/users' element={<Users token={token} />} />
            <Route path='/contact-messages' element={<ContactMessages token={token} />} />

          </Routes>
        </div>
      }
    </div>
  )
}

export default App

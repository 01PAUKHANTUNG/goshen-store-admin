import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import { backendUrl } from '../config.js'


const Login = ({ setToken }) => {


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitHandel = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
      if (response.data.success) {
        setToken(response.data.token)
      } else {
        toast.error("Wrong")
      }

    } catch (error) {

    }
  }

  return (

    <><ToastContainer />
      <div className='flex w-full h-full justify-center'>
        <div className='flex flex-col mt-[100px] gap-4 w-[500px] bg-slate-500 py-4 px-4 items-center rounded-md'>
          <p className='text-2xl'> LOGIN </p>

          <div className='w-full'>
            <form onSubmit={submitHandel}>
              <div className='flex flex-col w-full gap-4'>
                <input onChange={(e) => setEmail(e.target.value)} type='email' className='py-2 px-2' />
                <input onChange={(e) => setPassword(e.target.value)} type='password' className='py-2 px-2' />
                <button type='submit' className='bg-cyan-700 py-2 px-2 text-white text-center '> Login </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  )
}

export default Login

import React, { useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { backendUrl } from '../config.js'
import logo from '../assets/logo.jpg'

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
        toast.error("Invalid administrator credentials")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8f9fa]'>
      <ToastContainer />

      <div className='flex flex-col items-center mb-12'>
        <img className='w-32 mb-8' src={logo} alt='Goshen Logo' />
        <h1 className='text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase'>Admin Control Center</h1>
      </div>

      <div className='w-full max-w-[480px] bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden'>
        <div className='bg-black p-10 flex flex-col items-center text-center'>
          <h2 className='text-white text-2xl font-black tracking-tight mb-1'>Secure Gateway</h2>
          <p className='text-gray-400 text-xs font-bold uppercase tracking-widest'>Authorized Personnel Only</p>
        </div>

        <form onSubmit={submitHandel} className='p-10 md:p-12 space-y-8'>
          <div className='space-y-6'>
            <div className='flex flex-col gap-2'>
              <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>System ID / Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                placeholder='admin@goshen.com'
                className='w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold placeholder:text-gray-300'
                required
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Access Key</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                placeholder='••••••••'
                className='w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold placeholder:text-gray-300'
                required
              />
            </div>
          </div>

          <button
            type='submit'
            className='w-full py-5 bg-black text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-black/10 transition-all hover:bg-gray-800 hover:translate-y-[-2px] active:translate-y-[1px]'
          >
            Authenticate
          </button>

          <p className='text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest'>
            Goshen Management System • v2.0
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login

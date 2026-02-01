import React, { useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { backendUrl } from '../config.js'
import logo from '../assets/logo.jpg'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const submitHandel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
      if (response.data.success) {
        setToken(response.data.token)
        // No need to setLoading(false) as component will likely unmount
      } else {
        toast.error("Invalid administrator credentials")
        setLoading(false)
      }
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
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
            className='w-full py-5 bg-black text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-black/10 transition-all hover:bg-gray-800 hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={loading}
          >
            {loading ? (
              <div className='flex items-center justify-center gap-2'>
                <svg className='w-5 h-5 animate-spin' fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              'Authenticate'
            )}
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

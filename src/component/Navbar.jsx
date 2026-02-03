import React from 'react'
import logo from '../assets/logo.jpg'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='bg-white border-b border-gray-100 sticky top-0 z-50'>
      <div className='max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-12'>
          <NavLink to='/'>
            <img className='w-28 transition-transform hover:scale-105' src={logo} alt='logo' />
          </NavLink>

          <nav className='flex items-center gap-2'>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${isActive ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`
              }
            >
              Add Product
            </NavLink>
            <NavLink
              to='/orderlist'
              className={({ isActive }) =>
                `px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${isActive ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`
              }
            >
              Order List
            </NavLink>
            <NavLink
              to='/users'
              className={({ isActive }) =>
                `px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${isActive ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`
              }
            >
              Users
            </NavLink>
            <NavLink
              to='/contact-messages'
              className={({ isActive }) =>
                `px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${isActive ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`
              }
            >
              Inquiries
            </NavLink>
            <NavLink
              to='/settings'
              className={({ isActive }) =>
                `px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${isActive ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`
              }
            >
              Settings
            </NavLink>
          </nav>
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex flex-col items-end'>
            <p className='text-xs font-black text-gray-900'>Administrator</p>
            <div className='flex items-center gap-1.5'>
              <div className='w-1.5 h-1.5 bg-green-500 rounded-full'></div>
              <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>System Online</p>
            </div>
          </div>
          <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs font-black text-gray-900'>AD</div>
        </div>
      </div>
    </div>
  )
}

export default Navbar

import React from 'react'
import logo from '../assets/logo.jpg'
import add from '../assets/add.png'
import list from '../assets/list.png'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      <img className='w-[130px]' src={logo} alt='' />
      <div className='bg-slate-400 w-full '>

         <ul className='flex ml-4'>       
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex w-[200px] py-4 gap-4 justify-center hover:bg-white
                ${isActive ? 'bg-white' : ''}`
              }
            >
              <img className="w-[25px]" src={add} alt="" />
              <li>Add Product</li>
            </NavLink>

            <NavLink to='/orderlist' className={({ isActive }) =>
                `flex w-[200px] py-4 gap-4 bg-slate-400 justify-center hover:bg-white
                ${isActive ? 'bg-white' : ''}`
              }>
                <img className='w-[25px]' src={list} alt='' />
                <li>Order List</li>
            </NavLink>          
            
         </ul>
      </div>
    </div>
  )
}

export default Navbar

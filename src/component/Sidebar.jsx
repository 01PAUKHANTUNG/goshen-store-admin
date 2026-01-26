import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div className='w-64 min-h-screen bg-[#111111] text-white flex flex-col py-8'>
            {/* User Profile */}
            <div className='flex flex-col items-center mb-10'>
                <div className='w-20 h-20 rounded-full overflow-hidden border-2 border-gray-600 mb-3'>
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
                        alt="Admin"
                        className='w-full h-full object-cover'
                    />
                </div>
                <div className='text-center'>
                    <h3 className='text-lg font-semibold'>Sarah Smith <span className='text-xs ml-1 cursor-pointer'>✎</span></h3>
                    <p className='text-gray-400 text-sm'>Admin</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className='flex-1 px-4 space-y-2'>
                <NavLink
                    to="/orderlist"
                    className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#333333]' : 'hover:bg-[#222222]'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    <span className='font-medium'>Orders</span>
                </NavLink>

                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#333333]' : 'hover:bg-[#222222]'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span className='font-medium'>Product</span>
                </NavLink>

                <NavLink
                    to="/contact-messages"
                    className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#333333]' : 'hover:bg-[#222222]'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                    <span className='font-medium'>Contact Queries</span>
                </NavLink>

                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#333333]' : 'hover:bg-[#222222]'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <span className='font-medium'>Users</span>
                </NavLink>

                <NavLink
                    to="/invoice"
                    className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#333333]' : 'hover:bg-[#222222]'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className='font-medium'>Invoice</span>
                </NavLink>
            </nav>
        </div>
    )
}

export default Sidebar

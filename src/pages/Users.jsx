import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../config.js';
import { toast } from 'react-toastify';

const Users = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllUsers = async () => {
        if (!token) return null;
        try {
            const response = await axios.post(backendUrl + '/api/user/all-users', {}, { headers: { token } });
            if (response.data.success) {
                setUsers(response.data.users);
                setFilteredUsers(response.data.users);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, [token]);

    useEffect(() => {
        const result = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(result);
    }, [searchTerm, users]);

    return (
        <div className='p-8 bg-[#f8f9fa] min-h-screen'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
                    <div>
                        <h1 className='text-4xl font-black text-gray-900 tracking-tight mb-2'>Customers</h1>
                        <p className='text-gray-500 font-medium'>Manage and view all registered users of your store.</p>
                    </div>

                    <div className='flex flex-wrap items-center gap-4'>
                        {/* Stats Chips */}
                        <div className='flex gap-3 mr-4'>
                            <div className='px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm'>
                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Total Users</p>
                                <p className='text-xl font-black text-gray-900'>{users.length}</p>
                            </div>
                        </div>

                        <div className='relative group'>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className='pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition-all group-hover:shadow-md'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* User Cards List */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {filteredUsers.length === 0 ? (
                        <div className='col-span-full bg-white p-24 rounded-[2rem] border border-gray-50 shadow-sm flex flex-col items-center justify-center text-center'>
                            <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6'>
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                </svg>
                            </div>
                            <h3 className='text-2xl font-bold text-gray-900 mb-2'>No customers found</h3>
                            <p className='text-gray-500 max-w-sm'>Try adjusting your search terms to find users.</p>
                        </div>
                    ) : filteredUsers.map((user, index) => (
                        <div key={user._id} className='bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden'>
                            {/* Decorative background element */}
                            <div className='absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[4rem] -mr-10 -mt-10 group-hover:bg-purple-50 transition-colors duration-300'></div>

                            <div className='flex items-center gap-6 mb-8 relative'>
                                <div className='w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black'>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className='text-xl font-black text-gray-900 leading-tight'>{user.name}</h3>
                                    <div className='flex items-center gap-2 mt-1'>
                                        <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                        <span className='inline-block px-3 py-1 bg-gray-50 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full'>Verified Customer</span>
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-6 relative'>
                                <div>
                                    <span className='inline-block px-3 py-1 bg-blue-50 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-2'>Contact Email</span>
                                    <p className='text-sm text-gray-900 font-bold truncate' title={user.email}>{user.email}</p>
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <span className='inline-block px-3 py-1 bg-orange-50 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-2'>Phone</span>
                                        <p className='text-sm text-gray-900 font-bold'>{user.phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <span className='inline-block px-3 py-1 bg-green-50 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-2'>Joined</span>
                                        <p className='text-sm text-gray-900 font-bold'>Recently</p>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-8 pt-6 border-t border-gray-50 flex justify-between items-center relative'>
                                <button className='text-xs font-black text-gray-900 uppercase tracking-widest hover:text-black transition-colors flex items-center gap-2'>
                                    View Profile
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Users;

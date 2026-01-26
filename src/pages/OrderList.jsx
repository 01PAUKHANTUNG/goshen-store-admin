import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../config.js';
import { toast } from 'react-toastify';

const OrderList = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  useEffect(() => {
    let result = orders;

    if (searchTerm) {
      result = result.filter(order =>
        `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(result);
  }, [searchTerm, orders]);

  return (
    <div className='p-8 bg-[#f8f9fa] min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
          <div>
            <h1 className='text-4xl font-black text-gray-900 tracking-tight mb-2'>Orders</h1>
            <p className='text-gray-500 font-medium'>Manage and track your customer orders in real-time.</p>
          </div>

          <div className='flex flex-wrap items-center gap-4'>
            <div className='relative group'>
              <input
                type="text"
                placeholder="Search customers..."
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

        {/* Order Cards List */}
        <div className='grid grid-cols-1 gap-6'>
          {filteredOrders.length === 0 ? (
            <div className='bg-white p-24 rounded-[2rem] border border-gray-50 shadow-sm flex flex-col items-center justify-center text-center'>
              <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6'>
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>No orders found</h3>
              <p className='text-gray-500 max-w-sm'>Try adjusting your search to find what you're looking for.</p>
            </div>
          ) : filteredOrders.map((order, index) => (
            <div key={index} className='bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300'>
              <div className='grid grid-cols-1 md:grid-cols-6 gap-10'>
                {/* Meta Data */}
                <div className='col-span-1'>
                  <span className='inline-block px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4'>Order Meta</span>
                  <div className='space-y-1'>
                    <p className='text-xl font-black text-gray-900'>{new Date(order.createdAt || order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                    <p className='text-sm text-gray-400 font-bold'>{new Date(order.createdAt || order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                  </div>
                </div>

                {/* Customer Data */}
                <div className='col-span-1 md:border-l border-gray-100 md:pl-10'>
                  <span className='inline-block px-3 py-1 bg-blue-50 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4'>Customer</span>
                  <div className='space-y-1'>
                    <p className='text-lg font-black text-gray-900 leading-tight'>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p className='text-xs text-gray-400 font-bold truncate' title={order.shippingAddress.email}>{order.shippingAddress.email}</p>
                    <p className='text-sm text-gray-500 font-bold'>{order.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Items Data */}
                <div className='col-span-2 md:border-l border-gray-100 md:pl-10'>
                  <span className='inline-block px-3 py-1 bg-purple-50 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4'>Order Items</span>
                  <div className='space-y-3'>
                    {order.items.map((item, i) => (
                      <div key={i} className='flex items-start gap-3'>
                        <div className='w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0'></div>
                        <p className='text-sm text-gray-800 font-bold leading-tight'>
                          <span className='text-purple-600'>{item.quantity}</span>
                          <span className='text-gray-400 mx-1'>×</span>
                          {item.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Destination */}
                <div className='col-span-1 md:border-l border-gray-100 md:pl-10'>
                  <span className='inline-block px-3 py-1 bg-orange-50 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4'>Shipping</span>
                  <p className='text-lg font-black text-gray-900'>{order.shippingAddress.city}</p>
                  <p className='text-sm text-gray-400 font-bold'>{order.shippingAddress.country}</p>
                </div>

                {/* Cost */}
                <div className='col-span-1 md:border-l border-gray-100 md:pl-10 text-right'>
                  <span className='inline-block px-3 py-1 bg-green-50 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4'>Total Amount</span>
                  <p className='text-3xl font-black text-gray-900'>${order.amount.toFixed(2)}</p>
                  <div className={`inline-block mt-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                  </div>
                </div>
              </div>

              {/* Status Management Footer */}
              <div className='mt-10 pt-8 border-t border-gray-50 flex flex-wrap items-center justify-between gap-6'>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <div className={`w-3 h-3 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' :
                      order.status === 'Shipped' ? 'bg-blue-500' :
                        order.status === 'Out for delivery' ? 'bg-orange-400' : 'bg-gray-300'
                      }`}></div>
                    <span className='text-sm font-black text-gray-900 uppercase tracking-widest'>Current Status: {order.status}</span>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>Update Progress:</p>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className='pl-4 pr-10 py-2.5 border-2 border-gray-100 rounded-2xl bg-white text-sm font-black text-gray-700 focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all cursor-pointer hover:border-black'
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderList;

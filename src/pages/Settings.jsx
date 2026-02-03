import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../config.js'
import { toast, ToastContainer } from 'react-toastify'

const Settings = ({ token }) => {
    const [deliveryFee, setDeliveryFee] = useState(20)
    const [loading, setLoading] = useState(false)

    const fetchSettings = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/settings/get')
            if (response.data.success) {
                setDeliveryFee(response.data.settings.deliveryFee)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const updateSettings = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post(backendUrl + '/api/settings/update', { deliveryFee }, { headers: { token } })
            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    return (
        <div className='max-w-[1600px] mx-auto p-8 min-h-screen'>
            <ToastContainer />
            <div className='mb-10'>
                <h1 className='text-4xl font-black text-gray-900 tracking-tight mb-2'>Store Settings</h1>
                <p className='text-gray-500 font-medium'>Manage global configurations for your storefront.</p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start'>
                <form onSubmit={updateSettings} className='lg:col-span-6 admin-card space-y-8'>
                    <div>
                        <span className='admin-label'>Delivery Configuration</span>
                        <div className='mt-4 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col gap-6'>
                            <div className='flex flex-col gap-2'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Global Delivery Fee (USD)</label>
                                <div className='relative'>
                                    <span className='absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-gray-400'>$</span>
                                    <input
                                        type="number"
                                        value={deliveryFee}
                                        onChange={(e) => setDeliveryFee(Number(e.target.value))}
                                        className='admin-input pl-12 text-2xl font-black'
                                        placeholder="20.00"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <p className='text-[10px] font-bold text-gray-400 mt-2 px-1 leading-relaxed'>
                                    This amount is applied to all orders at checkout. Historical orders will retain their fee at the time of purchase.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Updating...</span>
                            </>
                        ) : (
                            'Save Settings'
                        )}
                    </button>
                </form>

                <div className='lg:col-span-6'>
                    <div className='admin-card bg-amber-50 border-amber-100 p-10'>
                        <div className='flex items-start gap-4 mb-6'>
                            <div className='w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center shrink-0'>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <h3 className='text-xl font-black text-gray-900'>System Note</h3>
                                <p className='text-sm text-gray-600 font-medium leading-relaxed mt-1'>
                                    Changes made here take effect immediately for new checkout sessions. If the delivery fee is set to 0, it will appear as "Free Delivery" to customers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings

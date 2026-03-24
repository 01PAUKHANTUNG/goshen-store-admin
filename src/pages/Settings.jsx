import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../config.js'
import { toast, ToastContainer } from 'react-toastify'

const Settings = ({ token }) => {
    const [deliveryFee, setDeliveryFee] = useState(20)
    const [deliveryThresholdKm, setDeliveryThresholdKm] = useState(30)
    const [feeBelowThreshold, setFeeBelowThreshold] = useState(10)
    const [feeAboveThreshold, setFeeAboveThreshold] = useState(12)
    const [freeDeliveryThresholdAmount, setFreeDeliveryThresholdAmount] = useState(200)
    const [storeLat, setStoreLat] = useState(0)
    const [storeLng, setStoreLng] = useState(0)
    const [storeAddress, setStoreAddress] = useState('')
    const [isGeocoding, setIsGeocoding] = useState(false)
    const [currencies, setCurrencies] = useState([])
    const [loading, setLoading] = useState(false)

    // Form state for new currency
    const [newCurrency, setNewCurrency] = useState({
        country: '',
        code: '',
        flag: '',
        unit: 1,
        buy: '',
        sell: ''
    })

    const fetchSettings = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/settings/get')
            if (response.data.success) {
                const s = response.data.settings;
                setDeliveryFee(s.deliveryFee)
                setDeliveryThresholdKm(s.deliveryThresholdKm || 30)
                setFeeBelowThreshold(s.feeBelowThreshold || 10)
                setFeeAboveThreshold(s.feeAboveThreshold || 12)
                setFreeDeliveryThresholdAmount(s.freeDeliveryThresholdAmount || 200)
                setStoreLat(s.storeLat || 0)
                setStoreLng(s.storeLng || 0)
                setCurrencies(s.currencies || [])
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
            const response = await axios.post(backendUrl + '/api/settings/update', {
                deliveryFee,
                deliveryThresholdKm,
                feeBelowThreshold,
                feeAboveThreshold,
                freeDeliveryThresholdAmount,
                storeLat,
                storeLng,
                currencies
            }, { headers: { token } })
            console.log("Admin received server response:", response.data)
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

    const handleGeocodeStore = async () => {
        if (!storeAddress) {
            toast.info("Please enter a store address to geocode")
            return
        }
        setIsGeocoding(true)
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(storeAddress)}&limit=1`)
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0]
                setStoreLat(Number(lat))
                setStoreLng(Number(lon))
                toast.success("Store coordinates updated from address")
            } else {
                toast.error("Could not find coordinates for this address")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error geocoding address")
        } finally {
            setIsGeocoding(false)
        }
    }

    const handleAddCurrency = () => {
        if (!newCurrency.country || !newCurrency.code || !newCurrency.flag || !newCurrency.buy || !newCurrency.sell) {
            toast.error("Please fill all currency fields")
            return
        }
        setCurrencies([...currencies, { ...newCurrency, buy: Number(newCurrency.buy), sell: Number(newCurrency.sell) }])
        setNewCurrency({ country: '', code: '', flag: '', unit: 1, buy: '', sell: '' })
    }

    const handleRemoveCurrency = (index) => {
        setCurrencies(currencies.filter((_, i) => i !== index))
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
                <div className='lg:col-span-8 flex flex-col gap-10'>

                    {/* DELIVERY SETTINGS */}
                    <form onSubmit={updateSettings} className='admin-card space-y-8'>
                        <div>
                            <span className='admin-label'>General Configuration</span>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Distance Threshold (KM)</label>
                                        <input
                                            type="number"
                                            value={deliveryThresholdKm}
                                            onChange={(e) => setDeliveryThresholdKm(Number(e.target.value))}
                                            className='admin-input px-6 py-4 text-xl font-black'
                                            placeholder="30"
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Free Delivery Threshold (Cart Total $)</label>
                                        <input
                                            type="number"
                                            value={freeDeliveryThresholdAmount}
                                            onChange={(e) => setFreeDeliveryThresholdAmount(Number(e.target.value))}
                                            className='admin-input px-6 py-4 text-xl font-black'
                                            placeholder="200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Fee Below Threshold ($)</label>
                                        <input
                                            type="number"
                                            value={feeBelowThreshold}
                                            onChange={(e) => setFeeBelowThreshold(Number(e.target.value))}
                                            className='admin-input px-6 py-4 text-xl font-black'
                                            placeholder="10"
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Fee Above Threshold ($)</label>
                                        <input
                                            type="number"
                                            value={feeAboveThreshold}
                                            onChange={(e) => setFeeAboveThreshold(Number(e.target.value))}
                                            className='admin-input px-6 py-4 text-xl font-black'
                                            placeholder="12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className='p-6 bg-amber-50 rounded-2xl border border-amber-100 space-y-4'>
                                    <h4 className='text-xs font-black text-amber-800 uppercase tracking-widest'>Store Location</h4>
                                    
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-[9px] font-bold text-amber-600 uppercase tracking-widest'>Search Store Address</label>
                                        <div className='flex gap-2'>
                                            <input
                                                type="text"
                                                value={storeAddress}
                                                onChange={(e) => setStoreAddress(e.target.value)}
                                                className='flex-1 bg-white border border-amber-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-medium'
                                                placeholder="e.g. 2C Station St, Ringwood VIC 3134, Australia"
                                            />
                                            <button 
                                                type="button" 
                                                onClick={handleGeocodeStore}
                                                disabled={isGeocoding}
                                                className='bg-amber-500 text-black px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 disabled:opacity-50'
                                            >
                                                {isGeocoding ? "..." : "Enter Store location"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-2'>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-[9px] font-bold text-amber-600 uppercase tracking-widest'>Store Latitude</label>
                                            <input
                                                type="number"
                                                value={storeLat}
                                                disabled
                                                onChange={(e) => setStoreLat(Number(e.target.value))}
                                                className='bg-white/50 border border-amber-100 rounded-xl px-4 py-3 outline-none font-mono text-xs'
                                                step="0.000001"
                                                required
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className='text-[9px] font-bold text-amber-600 uppercase tracking-widest'>Store Longitude</label>
                                            <input
                                                type="number"
                                                value={storeLng}
                                                disabled
                                                onChange={(e) => setStoreLng(Number(e.target.value))}
                                                className='bg-white/50 border border-amber-100 rounded-xl px-4 py-3 outline-none font-mono text-xs'
                                                step="0.000001"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <p className='text-[10px] text-amber-600 font-medium italic'>* These coordinates determine the distance for delivery fees.</p>
                                </div>
                        </div>

                        <div className='h-px bg-gray-100'></div>

                        {/* CURRENCY MANAGEMENT */}
                        <div>
                            <span className='admin-label'>Exchange Rates Management</span>
                            <div className='mt-4 space-y-6'>

                                {/* Add New Currency Form */}
                                <div className='p-8 bg-black rounded-[2rem] text-white'>
                                    <h3 className='text-xs font-black uppercase tracking-[0.2em] mb-6 text-amber-500'>Add New Currency</h3>
                                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                                        <div className='flex flex-col gap-1'>
                                            <label className='text-[9px] font-black text-gray-500 uppercase tracking-widest'>Country</label>
                                            <input value={newCurrency.country} onChange={e => setNewCurrency({ ...newCurrency, country: e.target.value })} className='bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500/50' placeholder='e.g. Myanmar' />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label className='text-[9px] font-black text-gray-500 uppercase tracking-widest'>Code</label>
                                            <input value={newCurrency.code} onChange={e => setNewCurrency({ ...newCurrency, code: e.target.value })} className='bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500/50' placeholder='e.g. MMK' />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label className='text-[9px] font-black text-gray-500 uppercase tracking-widest'>Flag Icon</label>
                                            <input value={newCurrency.flag} onChange={e => setNewCurrency({ ...newCurrency, flag: e.target.value })} className='bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-base outline-none focus:border-amber-500/50 text-center' placeholder='🇲🇲' />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label className='text-[9px] font-black text-gray-500 uppercase tracking-widest'>Buy Rate</label>
                                            <input type="number" value={newCurrency.buy} onChange={e => setNewCurrency({ ...newCurrency, buy: e.target.value })} className='bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500/50' placeholder='200' />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label className='text-[9px] font-black text-gray-500 uppercase tracking-widest'>Sell Rate</label>
                                            <input type="number" value={newCurrency.sell} onChange={e => setNewCurrency({ ...newCurrency, sell: e.target.value })} className='bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500/50' placeholder='100' />
                                        </div>
                                        <div className='flex items-end'>
                                            <button type="button" onClick={handleAddCurrency} className='w-full bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] py-3 rounded-xl hover:bg-amber-400 transition-colors'>
                                                Add to List
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Rates Table */}
                                <div className='bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm'>
                                    <table className='w-full text-left'>
                                        <thead>
                                            <tr className='bg-gray-50'>
                                                <th className='px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest'>Country</th>
                                                <th className='px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest'>Code</th>
                                                <th className='px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest'>Buy</th>
                                                <th className='px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest'>Sell</th>
                                                <th className='px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-50'>
                                            {currencies.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className='px-6 py-10 text-center text-xs text-gray-400 font-medium'>No currencies configured. Added rates will appear here.</td>
                                                </tr>
                                            ) : (
                                                currencies.map((curr, idx) => (
                                                    <tr key={idx} className='group hover:bg-gray-50/50'>
                                                        <td className='px-6 py-4'>
                                                            <div className='flex items-center gap-2'>
                                                                <span className='text-lg'>{curr.flag}</span>
                                                                <span className='font-bold text-gray-900'>{curr.country}</span>
                                                            </div>
                                                        </td>
                                                        <td className='px-6 py-4 font-black text-gray-500 text-xs'>{curr.code}</td>
                                                        <td className='px-6 py-4 font-black text-gray-900'>{curr.buy}</td>
                                                        <td className='px-6 py-4 font-black text-amber-600'>{curr.sell}</td>
                                                        <td className='px-6 py-4 text-right'>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveCurrency(idx)}
                                                                className='text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors'
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
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
                                    <span>Updating System...</span>
                                </>
                            ) : (
                                'Save All Settings'
                            )}
                        </button>
                    </form>
                </div>

                <div className='lg:col-span-4'>
                    <div className='admin-card bg-amber-50 border-amber-100 p-8'>
                        <div className='flex items-start gap-4 mb-6'>
                            <div className='w-10 h-10 bg-amber-400 rounded-2xl flex items-center justify-center shrink-0'>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <h3 className='text-base font-black text-gray-900'>System Integration</h3>
                                <p className='text-xs text-gray-600 font-medium leading-relaxed mt-2'>
                                    Exchange rates update dynamically on the main website's currency page.
                                    <br /><br />
                                    <strong className='text-black'>Buy Price:</strong> What you receive from customers.
                                    <br />
                                    <strong className='text-black'>Sell Price:</strong> What you give to customers.
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

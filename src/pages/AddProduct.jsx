import React, { useEffect, useState } from 'react'
import upload from '../assets/upload.png'
import subCategoryArray from '../assets/subCategory.js'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { backendUrl } from '../config.js'

const AddProduct = ({ token }) => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)
  const [existingImage1, setExistingImage1] = useState(null)
  const [productDescription, setProductDescription] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState([])
  const [sbCategory, setSbCategory] = useState('')
  const [price, setPrice] = useState('')
  const [bestseller, setBestseller] = useState(false)
  const [newArrive, setNewArrive] = useState(false)
  const [stockAvaiable, setStockAvaibale] = useState(false)
  const [list, setList] = useState([])
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const result = subCategoryArray.find(item => item.category === category)
    setSubCategory(result ? result.array : [])
  }, [category])

  const resetForm = () => {
    setEditingId(null)
    setProductDescription('')
    setPrice('')
    setCategory('')
    setSbCategory('')
    setExistingImage1(null)
    setImage1(null)
    setImage2(null)
    setImage3(null)
    setImage4(null)
    setBestseller(false)
    setNewArrive(false)
    setStockAvaibale(false)
  }

  const submitHandle = async (e) => {
    e.preventDefault()
    if (!editingId && !image1) {
      toast.error('Please select a product image');
      return;
    }
    try {
      const formData = new FormData()
      formData.append('description', productDescription)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', sbCategory)
      formData.append('bestSelling', bestseller)
      formData.append('newArrive', newArrive)
      formData.append('stockAvaiable', stockAvaiable)
      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      let response = editingId
        ? await axios.put(`${backendUrl}/api/product/update/${editingId}`, formData, { headers: { token } })
        : await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message)
        resetForm()
        fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`)
      if (response.data.success) setList(response.data.products)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { token } })
      toast.success(response.data.message)
      fetchList()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item._id)
    setProductDescription(item.description)
    setPrice(item.price)
    setCategory(item.category)
    setSbCategory(item.subCategory)
    setBestseller(item.bestSelling)
    setNewArrive(item.newArrive)
    setStockAvaibale(item.stockAvaiable)
    setExistingImage1(item.image)
    setImage1(null)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => { fetchList() }, [])

  return (
    <div className='max-w-[1600px] mx-auto p-8 h-screen '>

      <ToastContainer />

      {/* Page Header */}
      <div className='mb-10 overflow-y-auto '>
        <h1 className='text-4xl font-black text-gray-900 tracking-tight mb-2'>
          {editingId ? 'Edit Product' : 'Inventory Management'}
        </h1>
        <p className='text-gray-500 font-medium'>Control your stock, prices and product visibility.</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start'>

        {/* ================= MODERN FORM (4 cols) ================= */}
        <form onSubmit={submitHandle} className='lg:col-span-5 admin-card hide-scrollbar overflow-y-auto max-h-[calc(100vh-120px)]'>


          <div className='space-y-8'>

            {/* Image Upload Area */}
            <div>
              <span className='admin-label'>Product Imagery</span>
              <div className='flex gap-4 justify-center bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-100'>
                <label className='cursor-pointer group relative'>
                  <input type="file" hidden onChange={e => setImage1(e.target.files[0])} />
                  <div className='w-32 h-32 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden transition-all group-hover:shadow-lg group-hover:border-black'>
                    <img
                      src={image1 ? URL.createObjectURL(image1) : (existingImage1 || upload)}
                      className='w-full h-full object-contain'
                      alt='upload'
                    />
                    <div className='absolute inset-0 bg-black/5 items-center justify-center hidden group-hover:flex'>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                  </div>
                </label>
                {/* Secondary images placeholders would go here */}
              </div>
            </div>

            {/* Basic Info */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <span className='admin-label'>Main Category</span>
                <select value={category} onChange={e => { setCategory(e.target.value); setSbCategory('') }} className='admin-input' required>
                  <option value="">Select</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Beauti & Cosmetics">Beauty & Cosmetics</option>
                  <option value="Vegetables & Fruits">Fresh Produce</option>
                  <option value="Snacks & Drinks">Snacks</option>
                  <option value="Homewares">Homewares</option>
                  <option value="Books & Stationary">Stationery</option>
                </select>
              </div>
              <div>
                <span className='admin-label'>Sub Category</span>
                <select value={sbCategory} onChange={e => setSbCategory(e.target.value)} className='admin-input' required>
                  <option value="">Select</option>
                  {subCategory.map((item, i) => <option key={i} value={item}>{item}</option>)}
                </select>
              </div>
            </div>

            <div>
              <span className='admin-label'>Product Title & Description</span>
              <textarea
                value={productDescription}
                onChange={e => setProductDescription(e.target.value)}
                placeholder="Ex: Fresh Organic Apples from farm..."
                className='admin-input min-h-[100px] resize-none'
                required
              />
            </div>

            <div>
              <span className='admin-label'>Unit Price (USD)</span>
              <input
                type="text"
                value={price}
                placeholder="24.99"
                onChange={e => /^\d*\.?\d{0,2}$/.test(e.target.value) && setPrice(e.target.value)}
                className='admin-input text-xl font-black'
                required
              />
            </div>

            {/* Toggles */}
            <div className='flex flex-wrap gap-4 pt-2'>
              {[
                { state: bestseller, set: setBestseller, label: 'Best Seller' },
                { state: newArrive, set: setNewArrive, label: 'New Arrival' },
                { state: stockAvaiable, set: setStockAvaibale, label: 'In Stock' }
              ].map((item, idx) => (
                <label key={idx} className='flex-1 flex items-center justify-between p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors'>
                  <span className='text-[10px] font-black uppercase tracking-widest text-gray-500'>{item.label}</span>
                  <div className='relative'>
                    <input type="checkbox" className='sr-only' checked={item.state} onChange={e => item.set(e.target.checked)} />
                    <div className={`w-10 h-6 rounded-full transition-colors ${item.state ? 'bg-black' : 'bg-gray-200'}`}></div>
                    <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${item.state ? 'translate-x-4' : ''}`}></div>
                  </div>
                </label>
              ))}
            </div>

            <div className='flex gap-4 pt-4'>
              <button className='flex-1 bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10'>
                {editingId ? 'Update Product' : 'Publish Product'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className='px-8 border-2 border-gray-100 text-gray-400 font-bold rounded-2xl hover:border-red-500 hover:text-red-500 transition-all'>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* ================= MODERN LIST (8 cols) ================= */}
        <div className='lg:col-span-7 space-y-6 hide-scrollbar overflow-y-auto max-h-[calc(100vh-120px)]'>
          {list.map(item => (
            <div key={item._id} className='admin-card group hover:shadow-xl hover:-translate-y-1'>
              <div className='grid grid-cols-[auto_1fr_auto] gap-8 items-center'>
                <div className='w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100'>
                  <img src={item.image} className='w-full h-full object-contain p-2' alt='' />
                </div>

                <div className='space-y-1'>
                  <div className='flex items-center gap-3'>
                    <span className='px-3 py-1 bg-blue-50 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-lg'>{item.category}</span>
                    <span className='text-[10px] font-black text-gray-300 uppercase tracking-widest'>{item.subCategory}</span>
                  </div>
                  <h3 className='text-lg font-black text-gray-900 leading-tight'>{item.description}</h3>
                  <p className='text-2xl font-black text-gray-900'>${item.price.toFixed(2)}</p>
                </div>

                <div className='flex flex-col gap-2'>
                  <button onClick={() => handleEdit(item)} className='px-6 py-2 bg-gray-50 text-gray-900 font-bold rounded-xl hover:bg-black hover:text-white transition-all'>Edit</button>
                  <button onClick={() => removeProduct(item._id)} className='px-6 py-2 text-gray-400 font-bold rounded-xl hover:text-red-500 transition-all'>Remove</button>
                </div>
              </div>

              <div className='mt-6 pt-4 border-t border-gray-50 flex gap-6'>
                <div className='flex items-center gap-2'>
                  <div className={`w-2 h-2 rounded-full ${item.stockAvaiable ? 'bg-green-500' : 'bg-red-400'}`}></div>
                  <span className='text-[10px] font-black text-gray-500 uppercase tracking-widest'>{item.stockAvaiable ? 'In Stock' : 'Sold Out'}</span>
                </div>
                
                {item.bestSelling && (
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-amber-500'></div>
                    <span className='text-[10px] font-black text-gray-500 uppercase tracking-widest'>Best Seller</span>
                  </div>
                )}
                 {item.newArrive && (
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-green-500'></div>
                    <span className='text-[10px] font-black text-gray-500 uppercase tracking-widest'>New Arrive</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <div className='admin-card text-center py-20'>
              <p className='text-gray-400 font-bold'>No items in inventory yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default AddProduct
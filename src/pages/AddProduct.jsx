import React, { useEffect, useState } from 'react'
import upload from '../assets/upload.png'
import subCategoryArray from '../assets/subCategory.js'
import { toast } from 'react-toastify'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import { backendUrl } from '../App.jsx'

const AddProduct = ({ token }) => {

  // ================= STATES =================
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

  // ================= SUBCATEGORY =================
  useEffect(() => {
    const result = subCategoryArray.find(item => item.category === category)
    setSubCategory(result ? result.array : [])
  }, [category])

  // ================= RESET FORM =================
  const resetForm = () => {
    setEditingId(null)
    setProductDescription('')
    setPrice('')
    setCategory('')
    setSbCategory('')

//TAKE IMAGE PATH FROM DATABASE
    setExistingImage1(null)

    setImage1(null)
    setImage2(null)
    setImage3(null)
    setImage4(null)
    setBestseller(false)
    setNewArrive(false)
    setStockAvaibale(false)
  }

  // ================= ADD / UPDATE =================
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

      let response

      if (editingId) {
        // UPDATE
        response = await axios.put(
          `${backendUrl}/api/product/update/${editingId}`,
          formData,
          { headers: { token } }
        )
      } else {
        // ADD
        response = await axios.post(
          `${backendUrl}/api/product/add`,
          formData,
          { headers: { token } }
        )
      }

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

  // ================= LIST =================
  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`)
      if (response.data.success) {
        setList(response.data.products)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ================= REMOVE =================
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      )
      toast.success(response.data.message)
      fetchList()
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ================= EDIT =================
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
  }




  useEffect(() => {
    fetchList()
  }, [])

  // ================= UI =================
  return (
    <>
    <ToastContainer />
    <div className="flex w-full ">

      {/* ================= FORM ================= */}
      <form onSubmit={submitHandle} className="w-[30%] p-4 ">
        <h2 className="text-2xl mb-3">
          {editingId ? 'Update Product' : 'Add Product'}
        </h2>

        <label>
          <input type="file" hidden onChange={e => setImage1(e.target.files[0])} />
          <img  src={image1 ? URL.createObjectURL(image1) // new image
            : existingImage1
           ? existingImage1 // DB image
           : upload} className='border-2 border-gray-500 py-4  px-4 cursor-pointer w-[150px] h-[150px] mx-auto hover:shadow-lg' alt='' />
        </label>
        
      

        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setSbCategory('') }}
          className="w-full border p-2 mt-2 hover:shadow-lg"
          required
        >
          <option value="">Select Category</option>
          <option value="Groceries">Groceries</option>
          <option value="Beauti & Cosmetics">Beauti & Cosmetics</option>
          <option value="Vegetables & Fruits">Vegetables & Fruits</option>
          <option value="Snacks & Drinks">Snacks & Drinks</option>
          <option value="Homewares">Homewares</option>
          <option value="Books & Stationary">Books & Stationery</option>
          
        </select>

        <select
          value={sbCategory}
          onChange={e => setSbCategory(e.target.value)}
          className="w-full border p-2 mt-2 hover:shadow-lg"
          required
        >
          <option value="">Select SubCategory</option>
          {subCategory.map((item, i) => (
            <option key={i} value={item}>{item}</option>
          ))}
        </select>

         <input
          type="text"
          value={price}
          placeholder="00.00"
          onChange={e => /^\d*\.?\d{0,2}$/.test(e.target.value) && setPrice(e.target.value)}
          className="w-full border p-2 mt-2 hover:shadow-lg"
          required
        />


        <textarea
          value={productDescription}
          onChange={e => setProductDescription(e.target.value)}
          placeholder="Product Description"
          className="w-full border p-2 mt-2 hover:shadow-lg"
          required
        />

         <div className='flex gap-2'>
              <div className='flex gap-2  mt-2'>
                 <input checked={bestseller} onChange={(e)=>setBestseller(e.target.checked)} className='w-6 border-2 border-gray-500 cursor-pointer hover:shadow-lg' type='checkbox' />
                 <p className='font-semibold'> Best Seller </p>
              </div>
              <div className='flex gap-2  mt-2'>
                 <input checked={newArrive} onChange={(e)=>setNewArrive(e.target.checked)} className='w-6 border-2 border-gray-500 cursor-pointer hover:shadow-lg' type='checkbox' />
                 <p className='font-semibold'> New Arrive </p>
              </div>
              <div className='flex gap-2  mt-2'>
                 <input checked={stockAvaiable} onChange={(e)=>setStockAvaibale(e.target.checked)} className='w-6 border-2 border-gray-500 cursor-pointer hover:shadow-lg' type='checkbox' />
                 <p className='font-semibold'> Stock Avaiable </p>
              </div>
            </div>

        <button  className="w-full bg-green-600 text-white p-2 mt-3 hover:shadow-lg">
              {editingId ? 'Update Product' : 'Add Product'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full bg-gray-500 text-white p-2 mt-2 hover:shadow-lg"
          >
            Cancel Update
          </button>
        )}

      </form>

      {/* ================= LIST ================= */}
      <div className="w-[70%] p-4">
        {list.map(item => (
          <div key={item._id} className="border p-3 mb-3 flex justify-between hover:shadow-lg"> 

            <div className='grid grid-cols-[1fr_3fr_3fr_2fr_1fr] items-center'>
              <img src={item.image} className='w-[100px] h-[100px] py-1 px-1 ' />
                  <p className="font-bold">{item.description}</p>
                  <div className='flex flex-col gap-2'>
                  <p><span className='font-semibold'>Price : </span>${item.price}</p>
                  <p><span className='font-semibold'>Category : </span>{item.category}</p>
                  <p><span className='font-semibold'>Subcategory : </span>{item.subCategory}</p>
              </div>
              
              <div className='flex flex-col gap-2'>
                            <div className='flex gap-2'> 
                                <input checked={item.bestSelling} className='w-6' type='checkbox'/>
                                <p>Best Seller</p>
                          </div>
                            <div  className='flex gap-2 '> 
                                <input checked={item.newArrive} className='w-6' type='checkbox'/>
                                <p>New Arrive</p>
                          </div>
                            <div className='flex gap-2'> 
                                <input checked={item.stockAvaiable} className='w-6' type='checkbox' />
                                <p>Stock Avaiable</p>
                          </div>
                      </div>

              <div className='flex gap-2'>
              <button onClick={() => handleEdit(item)} className="bg-blue-500 text-white px-3 py-2 hover:bg-blue-600 rounded-md" >
                Update
              </button>

              <button onClick={() => removeProduct(item._id)} className="bg-red-500 text-white px-3 hover:bg-red-600 py-2  rounded-md">
                Remove
              </button>
              </div>
           
          </div>
           </div>
        ))}
      </div>

    </div>
     </>
  )
}

export default AddProduct

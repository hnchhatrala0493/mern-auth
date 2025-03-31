import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../context/AppContext';

const Profile = () => {
 const navigate = useNavigate();
 const {backendUrl,getUserData} = useContext(AppContent);
 const [name,setName]= useState('');
 const [email,setEmail]= useState('');

const details = getUserData();
console.log(details);


  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-violet-600 to-indigo-600'>
        <img src={assets.logo} onClick={()=>navigate("/")} alt='' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
        <form onSubmit='' className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Profile Update</h1>
            <p className='text-center mb-6 text-indigo-300'>Enter the profile detail below.</p>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.person_icon} alt="" className='w-3 h-3' />
                <input required value={name} onChange={e=>setName(e.target.value)} type='text' placeholder='Name' className='bg-transparent text-white  outline-none' />
            </div>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.mail_icon} alt="" className='w-3 h-3' />
                <input required type='email' value={email} placeholder='Email' onChange={e=>setEmail(e.target.value)} className='bg-transparent text-white  outline-none' />
            </div>
            <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Update Profile</button>
        </form>
    </div>
  )
}

export default Profile
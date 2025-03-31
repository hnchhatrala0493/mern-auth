import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [state,setState] = useState("Sign Up");
  const navigate = useNavigate();
  const {backendUrl,setIsLoggedIn,getUserData} = useContext(AppContent);
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const onSubmitHandler = async (e) =>{
    try {
      e.preventDefault();
      axios.defaults.withCredentials=true;
      if(state === "Sign Up"){
        const{data} = await axios.post(backendUrl +'/api/auth/register',{name,email,password});
        if(data.success){
          setIsLoggedIn(true)          
          setName("")          
          setEmail("")          
          setPassword("")
          toast.success(data.message)
          setState("Login")          
        } else {
          toast.error(data.message);
        }
      } else {
        const{data} = await axios.post(backendUrl +'/api/auth/login',{email,password});
        if(data.success){
          setIsLoggedIn(true)
          getUserData()
          toast.success(data.message)
          navigate('/')
        }else{
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }  
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-violet-600 to-indigo-600'>
      <img src={assets.logo} onClick={()=>navigate("/")} alt='' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === "Sign Up" ? "Create your account":"Login" }</h2>
        <p className='text-center text-sm mb-6'>{state === "Sign Up" ? "Create your account":"Sign in your account!" }</p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="Person icon" />
              <input type='text' onChange={e=>setName(e.target.value)} value={name} className='bg-transparent outline-none' placeholder='Enter a Full Name' />
            </div>
          )}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="Person icon" />
            <input type='email' onChange={e=>setEmail(e.target.value)} value={email} className='bg-transparent outline-none' placeholder='Enter an Email' />
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="Person icon" />
            <input type='password' onChange={e=>setPassword(e.target.value)} value={password} className='bg-transparent outline-none' placeholder='Enter a Password' />
          </div>
          {state === "Login" && (
            <p onClick={()=>navigate("/forgot-password")} className='mb-4 text-indigo-400 cursor-pointer'>Forgot Password</p>
          )}
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
        </form>
        {state === "Sign Up" ? (
          <p className='text-gray-400 text-center text-xl mt-4'>Already have account?
          <span onClick={()=>setState("Login")} className='text-blue-400 cursor-pointer underline'>Login here</span>
        </p>
        ) : (
          <p className='text-gray-400 text-center text-xl mt-4'>Don't have account?
            <span onClick={()=>setState("Sign Up")} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
          </p>
        ) }
      </div>
    </div>
  )
}

export default Login
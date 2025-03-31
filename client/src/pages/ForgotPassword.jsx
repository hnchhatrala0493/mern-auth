import React, { useContext, useState, useEffect  } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {backendUrl} = useContext(AppContent);
  const [email, setEmailId] = useState('');
  const [newPassword, setNewPassword]= useState('');
  const [confirmPassword, setConfirmPassword]= useState('');
  const [isEmailSent, setIsEmailSent]= useState('');
  const [emailOTP, setEmailOTP]= useState(0);
  const [IsOtpSubmit, setIsOtpSubmit]= useState(false);
  const inputRefs = React.useRef([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);
  const handleInput=(e,index)=>{
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index+1].focus();
    }
  }
  const handleDown=(e,index)=>{
    if(e.key==='Backspace' && e.target.value === '' && index > 0){
      inputRefs.current[index+1].focus();
    }
  }
  
  const handlePaste=(e)=>{
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char;      
      }
    })
  }

  const onSubmitEmail=async(e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl+ '/api/auth/send-forgot-password-otp',{email});
      data.success ? toast.success(data.message) : toast.error(data.message);
      setIsEmailSent(true) 
    } catch (error) {
      toast.error(error.message)
    }
  }
  const onSubmitVerifyOTP=async(e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl+ '/api/auth/verify-otp',{emailOTP});
      data.success ? toast.success(data.message) : toast.error(data.message);
      setIsOtpSubmit(true) 
    } catch (error) {
      toast.error(error.message)
    }
  }
  const onSubmitChangePassword=async(e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl+ '/api/auth/change-password',{newPassword});
      data.success ? toast.success(data.message) : toast.error(data.message);
      setIsEmailSent(true) 
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-l from-violet-500 to-violet-300'>
        <img src={assets.logo} onClick={()=>navigate("/")} alt='' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
        {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Forgot Password</h1>
            <p className='text-center mb-6 text-indigo-300'>Enter your registered email id.</p>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.mail_icon} alt="" className='w-3 h-3' />
              <input value={email} onChange={e=>setEmailId(e.target.value)} required type='email' placeholder='Enter an Email Address' className=' bg-transparent text-white  outline-none' />
            </div>
            <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Send OTP</button>
        </form>
        }
        {!IsOtpSubmit && isEmailSent && 
        <form onSubmit={onSubmitVerifyOTP} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Forgot Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_,index)=>(
              <input ref={e=>inputRefs.current[index] = e } onInput={(e)=>handleInput(e,index)} onKeyDown={(e)=>handleDown(e,index)} onChange={e=>setEmailOTP(e.target.value)}  type='text' maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'/>
            ))}
          </div>      
        <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>
        </form>
      }
      {IsOtpSubmit && isEmailSent &&
      <form onSubmit={onSubmitChangePassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the new password below.</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />
            <input value={newPassword} onChange={e=>setNewPassword(e.target.value)} required type='password' placeholder='New Password' className='bg-transparent text-white  outline-none' />
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />
            <input value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required type='password' placeholder='Confirm Password' className='bg-transparent text-white  outline-none' />
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
      </form>
      }
    </div>
  )
}

export default ForgotPassword
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './verify.css'
import { useDispatch, useSelector } from 'react-redux';
import { publicRequest } from '../requestMethod';
import { verifiedFailure, verifiedStarted, verifiedSuccess } from '../redux/userRedux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Verify = () => {
  const token = useSelector(state => state.user.currentUser.token)
  const currentUser = useSelector(state => state.user.currentUser.data)
  console.log(currentUser)
  console.log(token)
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  console.log(user)
  const codesRef = useRef(Array(6).fill(''))
  const inputs = useRef([]);
  const navigate = useNavigate()
  const handleChange = (e, index) => {
    const value = e.target.value
    console.log(value)
    codesRef.current[index] = value

    if (value !== "" && index < 5) {
      inputs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && codesRef.current[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  }
  const verifyHandler = async (e) => {
    e.preventDefault()
    const code = codesRef.current.join('')

    const obj = {
      otp: code
    }

    try {
      dispatch(verifiedStarted())
      const res = await publicRequest.post('/verifyemail', obj, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': `Bearer ${token}`,
        }
      })
      console.log(res.data.message)
      toast.success(res.data.message)
      setTimeout(() => {
        dispatch(verifiedSuccess(res.data))
        navigate('/')
      }, [5000])
    } catch (error) {
      dispatch(verifiedFailure())
      console.log(error)
      toast.info(error.response.data.message)
    }

  }

  const resetHandler = async(e) => {
    e.preventDefault()

    try {
      dispatch(verifiedStarted())
      const res = await publicRequest.post('/resendOtp', currentUser, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log(res.data.message)
      toast.success(res.data.message)
      // setTimeout(() => {
      //   dispatch(verifiedSuccess(res.data))
      //   navigate('/')
      // }, [5000])
    } catch (error) {
      dispatch(verifiedFailure())
      console.log(error)
      toast.info(error.response.data.message)
    }
  }
  return (
    <div className="container">
      <ToastContainer />
      <form action="" className='verifyForm'>
        <h2>Enter Verification Code</h2>
        <div>
          {codesRef.current.map((code, index) => (
            <input
              placeholder=''
              key={index}
              maxLength="1"
              ref={el => (inputs.current[index] = el)}
              onChange={e => handleChange(e, index)}
              onKeyDown={e => handleKeyDown(e, index)}
            />
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center'}}>
          <button onClick={verifyHandler}>Verify</button>
          <span>If OTP is expire <span onClick={resetHandler}><a href="">Click Now</a></span></span>
        </div>
      </form>
    </div>
  )
}

export default Verify

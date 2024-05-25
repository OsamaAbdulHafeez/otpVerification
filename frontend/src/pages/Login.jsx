import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './login.css'
import axios from 'axios'
import { publicRequest } from '../requestMethod'
import { useDispatch } from 'react-redux'
import { registerSuccess, verifiedFailure, verifiedStarted, verifiedSuccess } from '../redux/userRedux'
const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const email = useRef()
  const password = useRef()
  const loginHandler = async (e) => {
    e.preventDefault()
    const obj = {
      email: email.current.value,
      password: password.current.value,
    }
    try {
      dispatch(verifiedStarted())
      const res = await publicRequest.post('/login', obj, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log(res.data.data.isVerified)
      
      if (res.data.data.isVerified) {
        navigate('/')
        dispatch(verifiedSuccess(res.data))
      } else {
        navigate('/verifyemail')
        console.log(res.data)
        dispatch(registerSuccess(res.data))
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <div className="container">
        <form action="" className='loginForm' onSubmit={loginHandler}>
          <h2>Login Account</h2>
          <input type="email" placeholder='Email' ref={email} />
          <input type="password" placeholder='Password' ref={password} />
          <div>
            <button type='submit'>Log In</button>
            <Link to='/signup'><span>Don't Have an Account</span></Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './signup.css'
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { publicRequest } from '../requestMethod'
import { registerFailure, registerStart, registerSuccess } from '../redux/userRedux'
import CircularProgress from '@mui/material/CircularProgress';
const Signup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const firstName = useRef()
  const lastName = useRef()
  const email = useRef()
  const password = useRef()
  const cPassword = useRef()
  const user = useSelector(state => state.user)
  console.log(user.isFetching)
  const signupHandler = async (e) => {

    e.preventDefault()
    const obj = {
      firstName: firstName.current.value,
      lastName: lastName.current.value,
      email: email.current.value,
      password: password.current.value,
    }
    if(!firstName.current.value || !lastName.current.value || !email.current.value || 
      !password.current.value || !cPassword.current.value){
        return toast.error("Missing Fields")
      }
    if (password.current.value !== cPassword.current.value) {
      return toast.error("password or Re-type-Password not same")
    }
    try {
      dispatch(registerStart())
      const res = await publicRequest.post('http://localhost:5000/api/signup', obj, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      toast.success(res.data.message)
      dispatch(registerSuccess(res.data))
      firstName.current.value = ""
      lastName.current.value = ""
      email.current.value = ""
      password.current.value = ""
      cPassword.current.value = ""
      setTimeout(() => {
        navigate('/verifyemail')
      }, [5000])
    } catch (error) {
      dispatch(registerFailure())
      toast.error(error.response.data.message)
    }

  }

  return (
    <div>
      <div className="container">
        <ToastContainer />
        <form action="" className='signupForm' onSubmit={signupHandler}>
          <h2>Create Account</h2>
          <div>
            <input type="text" placeholder='Firstname' ref={firstName} />
            <input type="text" placeholder='Lastname' ref={lastName} />
          </div>
          <input type="email" placeholder='Email' ref={email} />
          <input type="password" placeholder='Password' ref={password} />
          <input type="password" placeholder='Re-type password' ref={cPassword} />
          <div>
            <button type='submit' disabled={user.isFetching}>{user.isFetching ? <CircularProgress sx={{ color: 'white' }} size={25}/> : "Sign Up"}</button>
            <Link to='/login'><span>Already Have an Account</span></Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup




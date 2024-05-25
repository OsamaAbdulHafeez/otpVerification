import React from 'react'
import './home.css'
import {useDispatch, useSelector} from 'react-redux'
import { logout } from '../redux/userRedux'
import { Link, useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const email = useSelector(state=>state.user.currentUser.data.email  )
  const logoutHandler = (e) => {
    e.preventDefault()
    dispatch(logout(null))
    navigate('/login')
  }
  return (
    <div className='homeContainer'>
      <h1>Welcome to Home page {email}</h1>
      <button onClick={logoutHandler}>Logout</button>
    </div>
  )
}

export default Home

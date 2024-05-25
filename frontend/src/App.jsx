import { Link } from 'react-router-dom'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import './App.css'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Verify from './pages/Verify';
import Home from './pages/Home';
import { useSelector } from 'react-redux';

function App() {

  // const user = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user)
  let user1
  try {
    const persistRoot = localStorage.getItem('persist:root');
    if (persistRoot) {
      const persistRootParsed = JSON.parse(persistRoot);
      if (persistRootParsed.user) {
        user1 = JSON.parse(persistRootParsed.user);
        console.log(user1)
      }
    }
  } catch (error) {
    console.error('Error parsing token from localStorage', error);
  }

  const user = useSelector(state=>state.user)
  console.log(user)
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/signup' element={user?.isLogging ? <Navigate to={'/'} /> : <Signup />} />
          <Route path='/login' element={user?.isLogging ? <Navigate to={'/'} /> : <Login />} />
          <Route path='/verifyemail' element={user?.isLogging ? <Navigate to={'/'} /> : <Verify/>}/>
          <Route path='/' element={user?.currentUser?.data?.isVerified ? <Home /> : <Navigate to={'/login'} />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

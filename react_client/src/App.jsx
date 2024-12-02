import { Link, Route, Routes } from 'react-router-dom';
import React from 'react';
import './App.css'
import Profile from "./components/Profile";
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <AuthProvider>
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>Website Name</h1>
          <div className='nav-links'>
            <Link className='profileLink' to='/profile'>Profile</Link>
          </div>
        </header>
        <Routes>
          <Route path='/home' element={<PrivateRoute />}>
            <Route path='/home' element={<Home />} />
          </Route>
          <Route path='/profile' element={<PrivateRoute />} >
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App

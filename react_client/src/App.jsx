import { Link, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import './App.css'
import Profile from "./components/Profile";
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import Home from './components/Home';

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>Website Name</h1>
          <Navigation />
        </header>
        <Routes>
          <Route path='/' element={<Navigate to='/home' replace />} />
          <Route path='/home' element={<Home />} />
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

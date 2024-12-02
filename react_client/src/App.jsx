import{Link, Route, Routes} from 'react-router-dom';
import React from 'react';
import './App.css'
import Profile from "./components/Profile";

function App() {

  return (
    <div className='App'>
      <header className='App-header'>
        <h1 className='App-title'>Website Name</h1>
        <div className='nav-links'>
          <Link className='profileLink' to='/profile'>Profile</Link>
        </div>
      </header>
      <Routes>
        <Route path='/profile/:id' element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App

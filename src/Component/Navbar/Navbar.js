import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutButton from '../LoginLogout/Logout';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Setting from '../Setting';

const Navbar = () => {
  const clientId = '223098918914-7rl4egn7ggo14994bkga1r42qarf20jv.apps.googleusercontent.com';
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const popupRef = useRef();
  const user = location.state && location.state.user;

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    
    console.log(`Searching for: ${searchQuery}`);
    navigate(`/search?query=${searchQuery}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div>
      <div className='navbar_main_container'>
        <img src='./Images/logo.png' alt="Logo" />
        <ul>
          <li>
            <form onSubmit={handleSearchSubmit} style={{display:'flex', alignItems:'center'}}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
              className='search_input'
              />
             <img  src='./Images/search_button.png' style={{width:'40px'}}/>
            </form>
          </li>
          <Link to='/'><li>Signup</li></Link>
          <Link to='/login'><li>Login</li></Link>
          <Link to='/visited_clients'><li>Visited Clients</li></Link>
          <Link to='/Artificial_intelligence'><li>AI</li></Link>
          <Link to='/transcribe_audio'><li>Transcribe Audio</li></Link>
          <Link to='/transcribe_ai'><li>Transcribe AI</li></Link>
          <Link to='/generate_image'>Generate Image</Link>
          {user && (
            <img
              src='./Images/profile_logo.png'
              style={{ width: '50px', cursor: 'pointer' }}
              alt="Profile Logo"
              onClick={togglePopup}
            />
          )}
          {isOpen && user && (
            <div className="popup" ref={popupRef}>
              <div className="popup-content">
                <div>
                  <p>{user.name}</p>
                  <p>{user.email}</p>
            
                </div>
                <button onClick={handleLogout}>Logout</button>
                {/* <GoogleOAuthProvider clientId={clientId}>
                  <LogoutButton />
                </GoogleOAuthProvider> */}
              </div>
            </div>
          )}
        </ul>
      </div>
    
    </div>
  );
};

export default Navbar;

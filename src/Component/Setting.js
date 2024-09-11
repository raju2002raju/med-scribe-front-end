import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar1 from './Navbar1';

const Setting = () => {
  const [activeTab, setActiveTab] = useState('Profile'); 
  const [userData, setUserData] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);


  const baseUrl = 'https://med-scribe-backend.onrender.com';


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await axios.get(`${baseUrl}/auth/user`, {
          headers: { 'user-email': email },
        });
        setUserData(response.data[0]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);




  const userEmail = localStorage.getItem('userEmail'); 

  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}/auth/logout`);
      localStorage.removeItem('userEmail');
      localStorage.removeItem(`${userEmail}_openAiApiKey`);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  return (
    <div className='opportunity-details'>
      <div className='interested-clients-dashboard'>
        <Navbar1 />
        <div style={{ width: '100%' }}>
          <header className='visited-clients-data'>
            <div style={{ display: 'flex' }}>
              <h1>SETTINGS</h1>
            </div>
            <div>
              {userData && (
                <>
                  <img
                    src={userData.profileImage || '../Images/Ellipse 232.png'}
                    className='profile-pic'
                  />
                  {showUserInfo && (
                    <div className='user-info'>
                      <p>{userData.name}</p>
                      <p>{userData.email}</p>
                      <button onClick={handleLogout}>Log Out</button>
                    </div>
                  )}
                </>
              )}
              <img
                src={showUserInfo ? './Images/arrowup.png' : './Images/arrowDown.png'}
                style={{ width: '30px', cursor: 'pointer' }}
                alt='Arrow'
                onClick={toggleUserInfo}
              />
            </div>
          </header>
          <div>
            <div className='d-flex'>
              <Link to='/setting/profile' onClick={() => setActiveTab('Profile')}>
                <p>Profile</p>
                <img src='../Images/Vector (5).png' />
              </Link>
            </div>
            <div className='d-flex'>
              <Link to='/setting/update-password' onClick={() => setActiveTab('Reset Password')}>
                <p>Reset Password</p>
                <img src='../Images/Vector (5).png' />
              </Link>
            </div>
            <div className='d-flex'>
              <Link to='/setting/update-keys-prompt' onClick={() => setActiveTab('Update Keys and Prompt')}>
                <p>Update Keys and Prompt</p>
                <img src='../Images/Vector (5).png' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;

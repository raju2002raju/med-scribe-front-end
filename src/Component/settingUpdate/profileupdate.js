import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar1 from '../Navbar1';
import { useNavigate } from 'react-router-dom';

const ProfileUpdate = () => {
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await axios.get('https://med-scribe-backend.onrender.com/auth/user', {
          headers: {
            'user-email': email,
          },
        });
        setUserData(response.data[0]);
        setProfileName(response.data[0].name);
        setProfileEmail(response.data[0].email);
        setProfilePhone(response.data[0].phone);
        setProfileImage(response.data[0].profileImage);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append('name', profileName);
    formData.append('email', profileEmail);
    formData.append('phone', profilePhone);
    if (profileImage instanceof File) {
      formData.append('profileImage', profileImage);
    }
  
    try {
      const email = localStorage.getItem('userEmail');
      const response = await axios.post('https://med-scribe-backend.onrender.com/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'user-email': email,
        },
      });
  
      if (response.status === 200) {
        const updatedImageUrl = response.data.profileImageUrl;
        setProfileImage(updatedImageUrl); 
        alert('Profile updated successfully!');
        window.location.href = '/setting/profile'; 
      } else {
        console.error('Failed to update profile:', response.statusText);
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };
  

  const handleBackClick = () => {
    navigate('/setting')
  }

  const getProfileImageSrc = () => {
    if (profileImage instanceof File) {
      return URL.createObjectURL(profileImage); // Preview of the new image file
    }
    return profileImage || '../Images/Ellipse 232.png'; // Existing or default image
  };

  return (
    <div className='opportunity-details'>
      <div className='interested-clients-dashboard'>
      <Navbar1 />
      <div style={{ width: '100%' }}>
        <header className='visited-clients-data'> 
       <div style={{ display: 'flex', alignItems:'center', gap:'20px'}}>
       <img src='../Images/back.png' onClick={handleBackClick} style={{width:'30px', height:'30px'}}/> 
       <h1>PROFILE</h1>
       </div>
        </header>
      <div className='profile'>
      
        <div className='profile-image-container'>
          <img
            src={getProfileImageSrc()}
            alt="Profile"
            className='profile-image'
          />
          <label htmlFor="profile-pic-upload" className='edit-icon'>
            <input type="file" id="profile-pic-upload" accept="image/*" onChange={handleImageChange} hidden />
            <img src='../Images/iconamoon_edit-fill.png' alt="Edit" />
          </label>
        </div>

        <div className='profile-info'>
          <input
            className='input_w_500'
            type='text'
            placeholder='Name'
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
          <input
            className='input_w_500'
            type='email'
            placeholder='Email'
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
          />
          <input
            className='input_w_500'
            type='tel'
            placeholder='Phone'
            value={profilePhone}
            onChange={(e) => setProfilePhone(e.target.value)}
          />
        </div>
      </div>
      <div className='search-div-button'>
        <button onClick={handleProfileUpdate}>Update</button>
      </div>
       </div>
    </div>
    </div>
  );
};

export default ProfileUpdate;

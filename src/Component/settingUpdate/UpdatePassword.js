import React, { useState } from 'react';
import Navbar1 from '../Navbar1';
import { useNavigate } from 'react-router-dom';



const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();


  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
  
    const payload = {
      oldPassword,
      newPassword,
    };

    const email = localStorage.getItem('userEmail');
  
    fetch('https://med-scribe-backend.onrender.com/api/reset-password-setting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-email': email 
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to reset password');
        }
        alert('Password updated successfully!');
      })
      .catch((error) => {
        console.error('Error resetting password:', error);
        alert('Failed to reset password. Please try again.');
      });
  };

  const handleBackClick = () => {
    navigate('/setting')
  }
  return (
    <div className='opportunity-details'>
      <div className='interested-clients-dashboard'>
      <Navbar1 />
      <div style={{ width: '100%' }}>
        <header className='visited-clients-data'> 
       <div style={{ display: 'flex', alignItems:'center', gap:'20px'}}>
       <img src='../Images/back.png' onClick={handleBackClick} style={{width:'30px', height:'30px'}}/> 
       <h1>RESET PASSWORD</h1>
       </div>
        </header>
        <div className='reset-pass'>
              <div className='reset-password-input'>
                <input
                  className='input_w_500'
                  type='password'
                  placeholder='Old Password'
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  className='input_w_500'
                  type='password'
                  placeholder='New Password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  className='input_w_500'
                  type='password'
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className='reset-div-button'>
                <button onClick={handleResetPassword}>Update</button>
              </div>
            </div>
       </div>
    </div>
    </div>
  );
};

export default UpdatePassword;

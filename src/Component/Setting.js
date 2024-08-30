import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar1 from './Navbar1';

const Setting = () => {
  const [ghlApiKey, setGhlApiKey] = useState('');
  const [openAiApiKey, setOpenAiApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('Profile');
  const [isActiveKeys, setIsActiveKeys] = useState('Keys');
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // State for passwords
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  useEffect(() => {
    const storedGhlApiKey = localStorage.getItem('ghlApiKey');
    if (storedGhlApiKey) setGhlApiKey(storedGhlApiKey);
  }, []);

  // Handle update of keys and prompt
  const handleUpdatedPrompt = () => {
    localStorage.setItem('ghlApiKey', ghlApiKey);

    const promptPayload = {
      prompt: prompt,
    };

    fetch('https://med-scribe-backend.onrender.com/config/api/update-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promptPayload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update prompt');
        }
        alert('Prompt updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating prompt:', error);
        alert('Failed to update prompt. Please try again.');
      });
  };

  const handleUpdateKey = () => {
    localStorage.setItem('ghlApiKey', ghlApiKey);

    const payload = {
      ghlApiKey: ghlApiKey,
      openAiApiKey: openAiApiKey,
    };

    fetch('https://med-scribe-backend.onrender.com/config/api/update-open-ai-api-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update API keys');
        }
        alert('API keys and prompt updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating API keys:', error);
        alert('Failed to update API keys. Please try again.');
      });
  };

  // Update profile details
  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append('name', profileName);
    formData.append('email', profileEmail);
    formData.append('phone', profilePhone);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
  
    try {
      const response = await axios.post('https://med-scribe-backend.onrender.com/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        const updatedImageUrl = response.data.profileImageUrl; 
        setProfileImage(updatedImageUrl); 
        alert('Profile updated successfully!');
      } else {
        console.error('Failed to update profile:', response.statusText);
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };
  

  // Handle password reset
  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
  
    const payload = {
      email: userEmail,
      oldPassword,
      newPassword,
    };
  
    fetch('https://med-scribe-backend.onrender.com/api/reset-password-setting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  

  return (
    <div className='opportunity-details'>
      <div className='interested-clients-dashboard'>
        <Navbar1 />
        <div style={{ width: '100%' }}>
          <header className='visited-clients-data'>
            <div style={{ display: 'flex' }}>
              <h1>SETTINGS</h1>
            </div>
            <img src="../Images/Ellipse 232.png" alt="Profile" className="profile-pic" />
          </header>
          <nav>
            <button className={activeTab === 'Profile' ? 'active' : ''} onClick={() => setActiveTab('Profile')}>Profile</button>
            <button className={activeTab === 'Reset Password' ? 'active' : ''} onClick={() => setActiveTab('Reset Password')}>Reset Password</button>
            <button className={activeTab === 'Update Keys and Prompts' ? 'active' : ''} onClick={() => setActiveTab('Update Keys and Prompts')}>Update Keys and Prompts</button>
          </nav>
          {activeTab === 'Profile' && (
            <div>
              <div className='profile'>
                <div className='profile-image-container'>
                  <img src={profileImage ? URL.createObjectURL(profileImage) : "./Images/Ellipse 232.png"} alt="Profile" className='profile-image' />
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
          )}
          {activeTab === 'Reset Password' && (
            <div className='reset-pass'>
              <div className='reset-password-input'>
              <input
                  className='input_w_500'
                  type='email'
                  placeholder='email'
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
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
          )}
          {activeTab === 'Update Keys and Prompts' && (
            <div className='keys-prompt'>
              <nav>
                <button
                  className={isActiveKeys === 'Keys' ? 'active' : ''}
                  onClick={() => setIsActiveKeys('Keys')}
                >
                  Keys
                </button>
                <button
                  className={isActiveKeys === 'Prompts' ? 'active' : ''}
                  onClick={() => setIsActiveKeys('Prompts')}
                >
                  Prompts
                </button>
              </nav>
              {isActiveKeys === 'Keys' && (
                <div className='keys-input-fields'>
                  <input
                    className='input_w_500'
                    type='text'
                    placeholder='GHL API Key'
                    value={ghlApiKey}
                    onChange={(e) => setGhlApiKey(e.target.value)}
                  />
                  <input
                    className='input_w_500'
                    type='text'
                    placeholder='OpenAI API Key'
                    value={openAiApiKey}
                    onChange={(e) => setOpenAiApiKey(e.target.value)}
                  />
                  <div  className='search-div-button'>

                <button onClick={handleUpdateKey}>Update</button>
                  </div>
                </div>
              )}
              {isActiveKeys === 'Prompts' && (
                <div className='keys-input-fields'>

                <textarea
                  className='input_w_500 input-prompt'
                  rows='8'
                  placeholder='Prompts'
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
              <div className='search-div-button'>
                <button onClick={handleUpdatedPrompt}>Update</button>
              </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;

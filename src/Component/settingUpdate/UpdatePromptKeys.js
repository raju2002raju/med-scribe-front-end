import React, { useEffect, useState } from 'react';
import Navbar1 from '../Navbar1';
import Pipeline from '../Pipline';
import { useNavigate } from 'react-router-dom';

const UpdatePromptKeys = () => {
  const [ghlApiKey, setGhlApiKey] = useState('');
  const [openAiApiKey, setOpenAiApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isActiveKeys, setIsActiveKeys] = useState('Keys');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

 
  const userEmail = localStorage.getItem('userEmail'); 

  useEffect(() => {
    if (userEmail) {
      
      fetch(`https://med-scribe-backend.onrender.com/config/get-ghl-api-key?email=${encodeURIComponent(userEmail)}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.ghlApiKey) {
            setGhlApiKey(data.ghlApiKey);
          }
        })
        .catch((error) => {
          console.error('Error fetching GHL API key:', error);
        });

      const storedOpenAiApiKey = localStorage.getItem(`${userEmail}_openAiApiKey`);
      if (storedOpenAiApiKey) setOpenAiApiKey(storedOpenAiApiKey);
    }
  }, [userEmail]);

  const handleUpdatedPrompt = () => {
    if (!userEmail) {
      alert('User not logged in. Please log in to update prompt.');
      return;
    }

    const promptPayload = {
      prompt: prompt,
      email: userEmail,
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
        setShowPopup(true);
      })
      .catch((error) => {
        console.error('Error updating prompt:', error);
        alert('Failed to update prompt. Please try again.');
      });
  };

  const handleUpdateKey = () => {
    if (!userEmail) {
      alert('User not logged in. Please log in to update API keys.');
      return;
    }

    const payload = {
      ghlApiKey: ghlApiKey,
      openAiApiKey: openAiApiKey,
      email: userEmail,
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
        localStorage.setItem(`${userEmail}_openAiApiKey`, openAiApiKey);
        alert('API keys updated successfully!');
        setShowPopup(true);
      })
      .catch((error) => {
        console.error('Error updating API keys:', error);
        alert('Failed to update API keys. Please try again.');
      });
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleBackClick = () => {
    navigate('/setting');
  };

  return (
    <div className='opportunity-details'>
      <div className='interested-clients-dashboard'>
        <Navbar1 />
        <div style={{ width: '100%' }}>
          <header className='visited-clients-data'>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img src='../Images/back.png' onClick={handleBackClick} style={{ width: '30px', height: '30px' }} />
              <h1>UPDATE KEY AND PROMPTS</h1>
            </div>
          </header>
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

                <div className='search-div-button'>
                  <button onClick={handleUpdateKey}>Update</button>
                </div>

                <div className='pipline-container'>
                  <Pipeline />
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
        </div>
      </div>

      {showPopup && (
        <div className='popup'>
          <div className='popup-content'>
            <div className='d-flex-j-s'>
              <button onClick={closePopup} className='cross-btn'>X</button>
            </div>
            <Pipeline />
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePromptKeys;

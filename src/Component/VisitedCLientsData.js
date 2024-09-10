import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FetchNote from './FetchNote';
import Navbar1 from './Navbar1';

const VisitedClientsData = () => {
  const { id } = useParams();   
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [activeTab, setActiveTab] = useState('General Data');
  const [ghlApiKey, setGhlApiKey] = useState('');
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    // Fetch API key if userEmail is present
    const fetchApiKey = async () => {
      try {
        const response = await fetch(
          `https://med-scribe-backend.onrender.com/config/get-ghl-api-key?email=${encodeURIComponent(userEmail)}`
        );
        const data = await response.json();
        if (data.ghlApiKey) {
          setGhlApiKey(data.ghlApiKey);
        }
      } catch (error) {
        console.error('Error fetching GHL API key:', error);
      }
    };
    
    if (userEmail) {
      fetchApiKey();
    }
  }, [userEmail]);

  useEffect(() => {
    const fetchOpportunityDetails = async () => {
      if (!ghlApiKey) return; // Wait until API key is fetched

      const url = `https://rest.gohighlevel.com/v1/pipelines/pJEZwEtP2TMvtnNw8FUm/opportunities/${id}`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {    
            'Authorization': `Bearer ${ghlApiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setItem(data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOpportunityDetails();
  }, [id, ghlApiKey]); 

  const handleBackClick = () => {
    navigate('/visited_clients');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='opportunity-details'>
      <div className='interested-clients-dashboard'>
        <Navbar1 />
        <div style={{ width: '100%' }}>
          <header className='visited-clients-data'>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button className="back-button" onClick={handleBackClick}>
                <img style={{ width: '20px' }} src='../Images/back-1.png' alt='Back' />
              </button>
              <h1>{item.name}</h1>
            </div>
          </header>
          <nav>
            <button
              className={activeTab === 'General Data' ? 'active' : ''}
              onClick={() => setActiveTab('General Data')}
            >
              General Data
            </button>

            <button
              className={activeTab === 'Data from Notes' ? 'active' : ''}
              onClick={() => setActiveTab('Data from Notes')}
            >
              Data from Notes
            </button>
          </nav>

          {activeTab === 'General Data' && item.contact && (
            <div className="general-data">
              <div className="data-row">
                <span>NAME</span>
                <span>{item.name}</span>
              </div>
              <div className="data-row">
                <span>PHONE</span>
                <span>{item.contact.phone}</span>
              </div>
              <div className="data-row">
                <span>EMAIL</span>
                <span>{item.contact.email}</span>
              </div>
            </div>
          )}

          {activeTab === 'Data from Notes' && item.contact && (
            <div>
              <FetchNote ContactIdClients={item.contact.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitedClientsData;

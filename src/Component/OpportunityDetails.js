import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InterestedClient from './InterestedClient';
import GetDataBackEnd from './GetDataBackEnd';
import FetchNote from './FetchNote';
import AppointmentDone from './AppointmentDone';
import AppointmentFailed from './AppointmentFailed';
import Navbar1 from './Navbar1';



const OpportunityDetails = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { id } = useParams();   
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('General Data');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunityDetails = async () => {
      const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlVubEJYYTlrSHIxRjI3VWxZT0tqIiwidmVyc2lvbiI6MSwiaWF0IjoxNzE2NTM4NjYxNjIyLCJzdWIiOiJZdG5JS1p2Yjh5dkNqemZaWlM1OSJ9.QatOP_sYaK8FHJbWlwgrYqeiKFt6x6Pr6IC_1nlBDek';  // Move to .env file in production
      const url = `https://rest.gohighlevel.com/v1/pipelines/pJEZwEtP2TMvtnNw8FUm/opportunities/${id}`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {    
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setOpportunity(data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOpportunityDetails();
  }, [id]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleBackClick = () => {
    navigate('/dashboard/transcribe_audio'); 
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
      <Navbar1/>
    <div style={{width: '100%'}}> 
        <header>
          <div className='desktop-back-button'>

        <button className="back-button" onClick={handleBackClick}><img style={{width:'40px'}} src='../Images/back.png'/></button>
          </div>
        <div className='mobile-back-button' onClick={handleBackClick}><img src='../Images/back-1.png' /></div>
        <h1>{opportunity.name}</h1>
      </header>
      <nav>
        <button 
          className={activeTab === 'General Data' ? 'active' : ''}
          onClick={() => setActiveTab('General Data')}
        >
          General Data
        </button>
        <button 
          className={activeTab === 'Get Data' ? 'active' : ''}
          onClick={() => setActiveTab('Get Data')}
        >
          Get Data
        </button>
        <button 
          className={activeTab === 'Data from Notes' ? 'active' : ''}
          onClick={() => setActiveTab('Data from Notes')}
        >
          Data from Notes
        </button>
      </nav>
      {activeTab === 'General Data' && (
        <div className="general-data">
          <div className="data-row">
            <span>NAME</span>
            <span>{opportunity.name}</span>
          </div>
          <div className="data-row">
            <span>PHONE</span>
            <span>{opportunity.contact.phone}</span>
          </div>
          <div className="data-row">
            <span>EMAIL</span>
            <span>{opportunity.contact.email}</span>
          </div>
          <div className="data-row">
            <span>APPOINTMENT DONE</span>
            <button className="action-button"><AppointmentDone ContactId={opportunity.id} name={opportunity.name} phone={opportunity.contact.phone} email={opportunity.contact.email} /></button>
          </div>
          <div className="data-row">
            <span>APPOINTMENT FAILED</span>
            <button className="action-button"><AppointmentFailed ContactId={opportunity.id} name={opportunity.name} phone={opportunity.contact.phone} email={opportunity.contact.email} /></button>
          </div>
          <div className="data-row">
            <span>RECORDING</span>
            <button className="action-button" onClick={openPopup}>🎙 Recording</button>
        
          </div>
          {isPopupOpen && (
<div className="popup-container">
<InterestedClient contactId={opportunity.id} onClose={closePopup} />

</div>
)}
        </div>
        
      )}
    {activeTab === 'Get Data' && (
        <div>
             
          <GetDataBackEnd ContactId={opportunity.id} ContactIdClients={opportunity.contact.id} />
          </div>
      )}

{activeTab === 'Data from Notes' && (
         <div>
<FetchNote ContactIdClients={opportunity.contact.id} />

         </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default OpportunityDetails;







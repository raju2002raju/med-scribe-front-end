import React, { useState, useEffect } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import FetchNote from './FetchNote';
import Navbar1 from './Navbar1';



const VisitedClientsData = () => {
  const { id } = useParams();   
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [activeTab, setActiveTab] = useState('General Data');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOpportunityDetails = async () => {
      const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlVubEJYYTlrSHIxRjI3VWxZT0tqIiwidmVyc2lvbiI6MSwiaWF0IjoxNzE2NTM4NjYxNjIyLCJzdWIiOiJZdG5JS1p2Yjh5dkNqemZaWlM1OSJ9.QatOP_sYaK8FHJbWlwgrYqeiKFt6x6Pr6IC_1nlBDek';
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
        setItem(data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOpportunityDetails();
  }, [id]);


  const handleBackClick = () => {
    navigate('/visited_clients')
  }


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
  <header className='visited-clients-data'>
  <div style={{display:'flex', gap:'20px'}}>
  <button className="back-button" onClick={handleBackClick}>  <img style={{width:'20px'}} src='../Images/back-1.png'/></button>
  <h1>{item.name}</h1>
  </div>

  <img src="../Images/Ellipse 232.png" alt="Profile" className="profile-pic" />
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

{activeTab === 'General Data' && (
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

{activeTab === 'Data from Notes' && (
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

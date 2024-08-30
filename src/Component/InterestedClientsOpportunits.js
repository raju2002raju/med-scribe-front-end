import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar1 from './Navbar1';

const InterestedClientsOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState(''); 
  const uniqueIds = new Set();

  const fetchOpportunities = async (page) => {
    const ghlApiKey = localStorage.getItem('ghlApiKey');
    const url = `https://rest.gohighlevel.com/v1/pipelines/pJEZwEtP2TMvtnNw8FUm/opportunities?page=${page}&pageSize=${pageSize}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ghlApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data.opportunities)) {
        const newOpportunities = data.opportunities.filter(item => {
          if (uniqueIds.has(item.id)) {
            return false;
          } else {
            uniqueIds.add(item.id);
            return true;
          }
        });

        setOpportunities(prevOpportunities => [...prevOpportunities, ...newOpportunities]);

        if (data.opportunities.length === pageSize) {
          setPage(prevPage => prevPage + 1);
        } else {
          setLoadingOpportunities(false);
        }
      } else {
        throw new Error('Data format is incorrect or Opportunities array is missing');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      setLoadingOpportunities(false);
    }
  };

  const fetchAppointments = async () => {
    const ghlApiKey = localStorage.getItem('ghlApiKey');
    const apiUrl = `https://rest.gohighlevel.com/v1/appointments/?startDate=1718971796000&endDate=1721879830000&userId=YtnIKZvb8yvCjzfZZS59&calendarId=FuhywKPvwBZdKT6dYUbT&teamId=YtnIKZvb8yvCjzfZZS59&includeAll=true`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${ghlApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Appointments data:', data);

      setAppointments(data.appointments); 
      setLoadingAppointments(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchOpportunities(page);
    fetchAppointments();
  }, [page]);

  // Filtered opportunities based on search query
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter(opportunity => opportunity.contact.tags[0] === 'interested_client')
      .filter(opportunity => 
        opportunity.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by search query
      );
  }, [opportunities, searchQuery]);

  if (loadingOpportunities && loadingAppointments) {
    return <div className='hourglass_container'>
      <div className='hourglass'>Loading....</div>
    </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='interested-clients-dashboard'>
      <Navbar1 />
      <div className="main-content">
        <header className='header-interested-clients'>
          <h4>APPOINTMENTS</h4>
          <div className="header-right">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <img className='search-icon-interested-clients' src='../Images/search.png' alt="Search" />
            </div>
            <div className="user-profile">
              <img src="../Images/Ellipse 232.png" alt="User" />
            </div>
          </div>
        </header>
        <div className="table-container">
          <table className="appointments-table">
            <thead>
              <tr className='heading-tr'>
                <th>Sr No.</th>
                <th>Name</th>
                <th>Appointment Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpportunities.map((opportunity, index) => {
                const matchingAppointment = appointments.find(app => app.contactId === opportunity.contact.id);
                const appointmentTime = matchingAppointment
                  ? `${new Date(matchingAppointment.startTime).toLocaleString()} - ${new Date(matchingAppointment.endTime).toLocaleTimeString()}`
                  : 'No Appointment';
                
                return (
                  <tr key={opportunity.id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/opportunity/${opportunity.id}`}>
                        {opportunity.name}
                      </Link>
                    </td>
                    <td>{appointmentTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );  
};

export default InterestedClientsOpportunities;

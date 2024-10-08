import React, { useState, useEffect } from 'react';
import Navbar1 from './Navbar1';
import { Link } from 'react-router-dom';

const InterestedClientsOpportunities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stageData, setStageData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showOpportunities, setShowOpportunities] = useState(false);
  const itemsPerPage = 100;

  const selectedStage = localStorage.getItem('stageId');
  const selectedPipeline = localStorage.getItem('selectedPipeline');
  const [ghlApiKey, setGhlApiKey] = useState('');

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
    }
  }, [userEmail]);

  useEffect(() => {
    if (ghlApiKey) {
      fetchAllStageData();
    }
  }, [ghlApiKey]);

  const fetchAllStageData = async () => {
    if (selectedPipeline && selectedStage) {
      setLoading(true);
      setError(null);
      let allData = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        try {
          const url = `https://rest.gohighlevel.com/v1/pipelines/${selectedPipeline}/opportunities?limit=100&page=${page}`;
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${ghlApiKey}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          allData = [...allData, ...data.opportunities];

          if (data.opportunities.length < 100) {
            hasMore = false;
          } else {
            page++;
          }
        } catch (error) {
          console.error('Error fetching stage data:', error);
          setError('Failed to fetch data. Please try again later.');
          hasMore = false;
        }
      }

      const filtered = allData.filter(opportunity => opportunity.pipelineStageId === selectedStage);
      setStageData(allData);
      setFilteredData(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setCurrentPage(1);
      setShowOpportunities(true);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredResults = searchQuery 
    ? filteredData.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredData;

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
                placeholder="Search Here...." 
                value={searchQuery} 
                onChange={handleSearch} 
              />
            </div>
          </div>
        </header>

        {/* Show Loading or Error Messages within the design */}
        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : !showOpportunities || filteredResults.length === 0 ? (
          <div className="no-data-message">No data available</div>
        ) : (
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
                {filteredResults.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/opportunity/${item.id}`}>
                        {item.name}
                      </Link>
                    </td>
                    <td>{item.appointmentTime || 'No Appointments'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestedClientsOpportunities;

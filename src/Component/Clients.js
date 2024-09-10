import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar1 from './Navbar1';

const Clients = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Start with page 1
  const [pageSize] = useState(20);
  const [hasMore, setHasMore] = useState(true); // To control pagination
  const [searchTerm, setSearchTerm] = useState('');

  const selectedStage = localStorage.getItem('stageId');
  const selectedPipeline = localStorage.getItem('selectedPipeline');

  const fetchAllStageData = async () => {
    if (selectedPipeline && selectedStage) {
      setLoading(true);
      setError(null);
      const ghlApiKey = localStorage.getItem('ghlApiKey');
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
          setError(error.message);
          hasMore = false;
        }
      }

      setOpportunities(allData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStageData();
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [opportunities, searchTerm]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='opportunity-details'>
      <div className='interested-clients-dashboard'>
        <Navbar1 />
        <div style={{ width: '100%' }}>
          <header className='header-interested-clients'>
            <h1>All Clients Data</h1>
            <div className='search-container'>
              <input
                type='text'
                placeholder='Search'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          <table className='appointments-table'>
            <thead>
              <tr className='table-row'>
                <th>Index</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpportunities.slice((page - 1) * pageSize, page * pageSize).map((item, index) => (
                <tr key={item.id}>
                  <td>{(page - 1) * pageSize + index + 1}</td>
                  <td>
                    <Link to={`/opportunity/${item.id}`}>{item.name}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOpportunities.length > page * pageSize && (
           <div className='client-btn-div'>
           <button className='client-btn' onClick={() => setPage((prevPage) => prevPage - 1)}>
          preview
        </button>
        <button className='client-btn' onClick={() => setPage((prevPage) => prevPage + 1)}>
          Next
        </button>
         </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;

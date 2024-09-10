import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar1 from './Navbar1';

const Clients = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ghlApiKey, setGhlApiKey] = useState('');
  const [fetchedData, setFetchedData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const selectedStage = localStorage.getItem('stageId');
  const selectedPipeline = localStorage.getItem('selectedPipeline');
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
    // Fetch opportunities when the API key or other dependencies change
    const fetchAllStageData = async () => {
      if (selectedPipeline && selectedStage && ghlApiKey) {
        setLoading(true);
        setError(null);

        let allData = [];
        let currentPage = 1;
        let hasMoreData = true;

        while (hasMoreData) {
          try {
            const url = `https://rest.gohighlevel.com/v1/pipelines/${selectedPipeline}/opportunities?limit=100&page=${currentPage}`;
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
              hasMoreData = false;
            } else {
              currentPage++;
            }
          } catch (error) {
            console.error('Error fetching stage data:', error);
            setError(error.message);
            hasMoreData = false;
          }
        }

        setFetchedData(allData);
        setHasMore(allData.length > pageSize * page);
        setLoading(false);
      }
    };

    fetchAllStageData();
  }, [selectedPipeline, selectedStage, ghlApiKey]);

  useEffect(() => {
    // Update opportunities based on pagination
    setIsFetching(true);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setOpportunities(fetchedData.slice(startIndex, endIndex));
    setIsFetching(false);
  }, [page, fetchedData]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [opportunities, searchTerm]);

  if (loading && !isFetching) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='opportunity-details'>
      <div className='interested-clients-dashboard'>
        <Navbar1 />
        <div style={{ width: '100%' }} className='all-clients-div'>
          <header className='header-interested-clients'>
            <h1>All Clients Data</h1>
            <div className='search-container'>
              <input
                type='text'
                placeholder='Search....'
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
              {filteredOpportunities.map((item, index) => (
                <tr key={item.id}>
                  <td>{(page - 1) * pageSize + index + 1}</td>
                  <td>
                    <Link to={`/item/${item.id}`}>{item.name}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='client-btn-div'>
            <button
              className='client-btn'
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className='client-btn'
              onClick={() => setPage((prevPage) => prevPage + 1)}
              disabled={!hasMore}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;

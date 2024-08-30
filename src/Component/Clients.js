import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar1 from './Navbar1';

// Utility function to debounce search input
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Clients = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const uniqueIds = useMemo(() => new Set(), []); // memoize uniqueIds to persist across renders
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search input with 300ms delay

  const fetchOpportunities = useCallback(async (page = 1) => {
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
          fetchOpportunities(page + 1); 
        } else {
          setLoading(false); 
        }
      } else {
        throw new Error('Data format is incorrect or Opportunities array is missing');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [pageSize, uniqueIds]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Filtered results with memoization to avoid unnecessary computations
  const filteredVisitedClients = useMemo(() => {
    return opportunities.filter(item =>
      item.contact.tags[0] === 'ready_to_visit' &&
      item.contact.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [opportunities, debouncedSearchTerm]);

  if (loading) {
    return (
      <div className='hourglass_container'>
        <div className='hourglass'></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='opportunity-details'>
      <div className='interested-clients-dashboard'>
        <Navbar1 />
        <div style={{ width: '100%' }}>
          <header className='header-interested-clients'>
            <h1>VISITED CLIENTS</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          <table className="appointments-table">
            <thead>
              <tr className='table-row'>
                <th>Index</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitedClients.map((item, index) => (
                <tr key={item.id} className='table-row'>
                  <td>{index + 1}</td>
                  <td><Link to={`/item/${item.id}`}>{item.contact.name}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clients;

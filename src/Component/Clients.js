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
  const [page, setPage] = useState(1); // Start with page 1
  const [pageSize] = useState(20);
  const [hasMore, setHasMore] = useState(true); // To control pagination
  const [searchTerm, setSearchTerm] = useState('');
  const uniqueIds = useMemo(() => new Set(), []);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetching opportunities with pagination
  const fetchOpportunities = useCallback(async () => {
    if (!hasMore) return; // Stop fetching if no more data to load

    setLoading(true); // Show loading indicator

    const ghlApiKey = localStorage.getItem('ghlApiKey');
    const url = `https://rest.gohighlevel.com/v1/pipelines/pJEZwEtP2TMvtnNw8FUm/opportunities?page=${page}&pageSize=${pageSize}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ghlApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data.opportunities)) {
        const newOpportunities = data.opportunities.filter((item) => {
          if (uniqueIds.has(item.id)) {
            return false;
          } else {
            uniqueIds.add(item.id);
            return true;
          }
        });

        setOpportunities((prevOpportunities) => [...prevOpportunities, ...newOpportunities]);

        // Check if more data is available
        if (data.opportunities.length < pageSize) {
          setHasMore(false); // No more data to load
        } else {
          setPage((prevPage) => prevPage + 1); // Increment the page for the next fetch
        }
      } else {
        throw new Error('Data format is incorrect or Opportunities array is missing');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  }, [page, pageSize, hasMore, uniqueIds]);

  useEffect(() => {
    fetchOpportunities(); // Fetch data on component mount
  }, [fetchOpportunities]);

  // Filtered results with memoization to avoid unnecessary computations
  const filteredVisitedClients = useMemo(() => {
    return opportunities.filter(
      (item) =>
        item.contact.tags[0] === 'ready_to_visit' &&
        item.contact.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [opportunities, debouncedSearchTerm]);

  // Load more data when the user scrolls to the bottom
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
      fetchOpportunities(); // Fetch next set of data
    }
  }, [fetchOpportunities, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
              {filteredVisitedClients.map((item, index) => (
                <tr key={item.id} className='table-row'>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/item/${item.id}`}>{item.contact.name}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Show loading indicator at the bottom while fetching more data */}
          {loading && (
            <div className='hourglass_container'>
              <div className='hourglass'>Loading...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;

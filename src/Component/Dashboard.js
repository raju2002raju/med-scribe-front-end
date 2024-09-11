import React, { useState, useEffect } from 'react';
import DashboardAi from './DashboardAi';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ghlApiKey, setGhlApiKey] = useState('');
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (userEmail) {
      fetch(`https://med-scribe-backend.onrender.com/config/get-ghl-api-key?email=${encodeURIComponent(userEmail)}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.ghlApiKey) {
            setGhlApiKey(data.ghlApiKey);
          } else {
            alert('Please provide GHL Key to proceed.');
            navigate('/setting/update-keys-prompt');
          }
        })
        .catch((error) => {
          console.error('Error fetching GHL API key:', error);
        });
    } else {
      navigate('/login'); 
    }
  }, [userEmail, navigate]);

  useEffect(() => {
    if (!userEmail || !ghlApiKey) return;

    const currentDate = new Date();
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + 6);

    const startDateTimestamp = Math.floor(currentDate.getTime());
    const endDateTimestamp = Math.floor(endDate.getTime());

    const apiUrl = `https://rest.gohighlevel.com/v1/appointments/?startDate=${startDateTimestamp}&endDate=${endDateTimestamp}&userId=YtnIKZvb8yvCjzfZZS59&calendarId=FuhywKPvwBZdKT6dYUbT&teamId=YtnIKZvb8yvCjzfZZS59&includeAll=true`;

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ghlApiKey}`,
      }
    };

    fetch(apiUrl, options)
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
            if (response.status === 401) {
              alert('Your API key is invalid? Please update correct API key')
              navigate('/setting/update-keys-prompt');
              throw new Error('Invalid API Key. Redirecting to update keys...');
            }
            throw new Error(`Network response was not ok: ${response.statusText} - ${JSON.stringify(errData)}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('API Response:', data);
        if (Array.isArray(data.appointments)) {
          setData(data.appointments);
        } else {
          throw new Error('Data format is incorrect or array is missing');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, [userEmail, ghlApiKey, navigate]);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div className='dashboard-m-container'>
      {error ? (
        <div className="error-message" style={{ color: 'red', marginTop: '20px' }}>
          Error: {error.message}
        </div>
      ) : (
        <div>
          <DashboardAi />
        </div>
      )}
    </div>
  );
}

export default Dashboard;

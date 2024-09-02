import React, { useState, useEffect } from 'react';
import DashboardAi from './DashboardAi';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ghlApiKey = localStorage.getItem('ghlApiKey');

    if (!ghlApiKey) {
      alert('Please provide GHL Key to proceed.');
      navigate('/setting'); 
      return;
    }

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
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='dashboard-m-container'>
      <div>
        <div>
          <DashboardAi />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

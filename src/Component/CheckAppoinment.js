import React, { useState, useEffect } from 'react';

function CheckAppoinment() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentDate = new Date();
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + 6);

    const startDateTimestamp = Math.floor(currentDate.getTime());
    const endDateTimestamp = Math.floor(endDate.getTime());
    useEffect(() => {
      const apiUrl = `https://rest.gohighlevel.com/v1/appointments/?startDate=${startDateTimestamp}&endDate=${endDateTimestamp}&userId=YtnIKZvb8yvCjzfZZS59&calendarId=FuhywKPvwBZdKT6dYUbT&teamId=YtnIKZvb8yvCjzfZZS59&includeAll=true`;
      const ghlApiKey = localStorage.getItem('ghlApiKey');    
            const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ghlApiKey}`
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
                sendDataToBackend(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);
    
    const sendDataToBackend = async (data) => {
        try {
            const response = await fetch('http://localhost:8080/clientData/sendData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to send data to backend');
            }
            console.log('Data sent to backend successfully');
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };
    
    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error.message}</div>;
    // return (
    //     <div>
    //         <table>
    //                 <tbody>
    //                 {data.map(team => (
    //                     <tr key={team.id}>
    //                         <td>{JSON.stringify(data)}</td>
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //     </div>
    // );
}

export default CheckAppoinment;
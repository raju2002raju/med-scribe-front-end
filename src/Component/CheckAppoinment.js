import React, { useState, useEffect } from 'react';

function CheckAppointment() {
    const [loading, setLoading] = useState(true);
    const [ghlApiKey, setGhlApiKey] = useState(''); 

    const currentDate = new Date();
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + 6);

    const startDateTimestamp = Math.floor(currentDate.getTime());
    const endDateTimestamp = Math.floor(endDate.getTime());
    const userEmail = localStorage.getItem('userEmail'); 

    useEffect(() => {
        const fetchGhlApiKey = async () => {
            try {
                const response = await fetch(`https://med-scribe-backend.onrender.com/config/get-ghl-api-key?email=${userEmail}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch GHL API key');
                }
                const result = await response.json();
                setGhlApiKey(result.ghlApiKey); 
            } catch (error) {
                console.error('Error fetching GHL API key:', error);
                setLoading(false);
            }
        };

        fetchGhlApiKey();
    }, []);

    useEffect(() => {
        if (!ghlApiKey) return; 

        const apiUrl = `https://rest.gohighlevel.com/v1/appointments/?startDate=${startDateTimestamp}&endDate=${endDateTimestamp}&userId=YtnIKZvb8yvCjzfZZS59&calendarId=FuhywKPvwBZdKT6dYUbT&teamId=YtnIKZvb8yvCjzfZZS59&includeAll=true`;

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
    }, [ghlApiKey]);

    const sendDataToBackend = async (data) => {
        try {
            const response = await fetch('https://med-scribe-backend.onrender.com/clientData/sendData', {
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

}

export default CheckAppointment;

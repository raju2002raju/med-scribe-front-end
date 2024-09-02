import React, { useEffect, useState } from 'react';

const ClientsSendData = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transcriptions, setTranscriptions] = useState([]);
  const [clientIds, setClientIds] = useState({ interestedClients: [], readyToVisitClients: [] });
  const [dataSent, setDataSent] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    const fetchOpportunities = async (page = 1) => {
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
          const interestedClients = [];
          const readyToVisitClients = [];

          data.opportunities.forEach(opportunity => {
            if (opportunity.contact.tags.includes('interested_client')) {
              interestedClients.push(opportunity.contact.id);
            }
            if (opportunity.contact.tags.includes('ready_to_visit')) {
              readyToVisitClients.push(opportunity.contact.id);
            }
          });

          setOpportunities(prevOpportunities => [...prevOpportunities, ...data.opportunities]);
          setClientIds(prevClientIds => ({
            interestedClients: [...prevClientIds.interestedClients, ...interestedClients],
            readyToVisitClients: [...prevClientIds.readyToVisitClients, ...readyToVisitClients]
          }));

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
    };

    fetchOpportunities();
  }, []);

  useEffect(() => {
    const fetchAllNotes = async () => {
      const ghlApiKey = localStorage.getItem('ghlApiKey');
      const allClientIds = [
        ...clientIds.interestedClients,
        ...clientIds.readyToVisitClients
      ];

      const notesPromises = allClientIds.map(async clientId => {
        try {
          const apiUrl = `https://rest.gohighlevel.com/v1/contacts/${clientId}/notes/`;
          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${ghlApiKey}`
            }
          };

          const response = await fetch(apiUrl, options);
          if (!response.ok) {
            throw new Error(`Failed to fetch notes for client ID ${clientId}`);
          }

          const result = await response.json();
          return result.notes.map(note => ({
            clientId: clientId,
            text: note.body.split('\n')[0]
          }));
        } catch (error) {
          console.error(`Error fetching notes for client ID ${clientId}:`, error);
          return [];
        }
      });

      try {
        const notesResults = await Promise.all(notesPromises);
        const allNotes = notesResults.flat();

        setTranscriptions(allNotes);
        sendDataToBackend(allNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (!loading && !dataSent && clientIds.interestedClients.length > 0 && clientIds.readyToVisitClients.length > 0) {
      fetchAllNotes();
    }
  }, [clientIds, loading, dataSent]);

  const sendDataToBackend = async (allNotes) => {
    try {
      const filteredOpportunities = opportunities.filter(opportunity =>
        opportunity.contact.tags.includes('interested_client')
      );

      const filteredVisitedClients = opportunities
        .filter(client => client.contact.tags.includes('ready_to_visit'))
        .map(client => ({
          name: client.contact.name,
          email: client.contact.email,
          phoneNumber: client.contact.phone,
          transcriptions: allNotes.filter(note => note.clientId === client.contact.id).map(note => note.text)
        }));

      const dataToSend = {
        opportunities: filteredOpportunities.map(opportunity => ({
          name: opportunity.contact.name,
          email: opportunity.contact.email,
          phoneNumber: opportunity.contact.phone,
          contactId: opportunity.contact.id,
          transcriptions: allNotes.filter(note => note.clientId === opportunity.contact.id).map(note => note.text)
        })),
        visitedClients: filteredVisitedClients,
      };

      const response = await fetch('http://localhost:8080/clientData/clientData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error('Failed to send data to backend');
      }

      console.log('Data sent to backend successfully');
      setDataSent(true);
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  // return (
  //   <div>
  //     <p>Data fetched and sent to the backend successfully.</p>
  //   </div>
  // );
};

export default ClientsSendData;

import React, { useEffect, useState } from 'react';
import InterestedClientsOpportunities from './InterestedClientsOpportunits';

const Pipeline = () => {
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ghlApiKey, setGhlApiKey] = useState(''); 
  const userEmail = localStorage.getItem('userEmail'); 

  
  useEffect(() => {
    const fetchGhlApiKey = async () => {
      try {
        const response = await fetch(`https://med-scribe-backend.onrender.com/config/get-ghl-api-key?email=${userEmail}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch GHL API Key: ${response.statusText}`);
        }
        const data = await response.json();
        setGhlApiKey(data.ghlApiKey); // Set the GHL API key from the response
      } catch (error) {
        console.error('Error fetching GHL API Key:', error);
        setError(error.message);
      }
    };

    if (userEmail) {
      fetchGhlApiKey();
    }
  }, [userEmail]);

  // Fetch pipelines using the GHL API Key
  useEffect(() => {
    if (!ghlApiKey) return; // Wait until the GHL API Key is fetched

    const fetchPipelines = async () => {
      try {
        const response = await fetch('https://rest.gohighlevel.com/v1/pipelines/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${ghlApiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setPipelines(result.pipelines);
      } catch (error) {
        console.error('Error fetching pipelines:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPipelines();
  }, [ghlApiKey]);

  const handlePipelineChange = (event) => {
    const selectedPipelineId = event.target.value;
    const pipeline = pipelines.find((pipeline) => pipeline.id === selectedPipelineId);
    setSelectedPipeline(pipeline);
    setSelectedStage(null);
  };

  const handleStageChange = (event) => {
    setSelectedStage(event.target.value);
  };

  const handleUpdateClick = () => {
    localStorage.setItem('stageId', selectedStage);
    localStorage.setItem('selectedPipeline', selectedPipeline?.id || '');
    alert('Thanks for the update');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='d-flex-justify'>
      <h2>Select a Pipeline</h2>
      <select 
        onChange={handlePipelineChange} 
        value={selectedPipeline?.id || ''} 
        className='w-300'
      >
        <option value="">Select a pipeline</option>
        {pipelines.map((pipeline) => (
          <option key={pipeline.id} value={pipeline.id}>
            {pipeline.name}
          </option>
        ))}
      </select><br />

      {selectedPipeline && (
        <div>
          <h3>Stages for {selectedPipeline.name}</h3>
          <select 
            onChange={handleStageChange} 
            value={selectedStage || ''} 
            className='w-300'
          >
            <option value="">Select a stage</option>
            {selectedPipeline.stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select><br />
        </div>
      )}

      <button className='w-300' onClick={handleUpdateClick}>Update</button>
    </div>
  );
};

export default Pipeline;

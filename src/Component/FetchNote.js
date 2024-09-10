import React, { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

function FetchNote({ ContactIdClients }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://rest.gohighlevel.com/v1/contacts/${ContactIdClients}/notes/`;
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlVubEJYYTlrSHIxRjI3VWxZT0tqIiwidmVyc2lvbiI6MSwiaWF0IjoxNzE2NTM4NjYxNjIyLCJzdWIiOiJZdG5JS1p2Yjh5dkNqemZaWlM1OSJ9.QatOP_sYaK8FHJbWlwgrYqeiKFt6x6Pr6IC_1nlBDek';

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
        if (Array.isArray(data.notes)) {
          setData(data.notes);
        } else {
          throw new Error('Data format is incorrect or notes array is missing');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, [ContactIdClients]);

  const handleDeleteRow = async (id) => {
    const newData = data.filter(item => item.id !== id);
    setData(newData);

    try {
      const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/${ContactIdClients}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlVubEJYYTlrSHIxRjI3VWxZT0tqIiwidmVyc2lvbiI6MSwiaWF0IjoxNzE2NTM4NjYxNjIyLCJzdWIiOiJZdG5JS1p2Yjh5dkNqemZaWlM1OSJ9.QatOP_sYaK8FHJbWlwgrYqeiKFt6x6Pr6IC_1nlBDek'
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`Network response was not ok: ${response.statusText} - ${JSON.stringify(errData)}`);
      }

    } catch (error) {
      console.error('Error deleting row:', error);
      setError(error);
    }
  };

  const downloadTranscript = (transcript) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun(transcript)
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'transcript.docx');
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data.length) return <div>No data available</div>;

  return (
  <div>
      <div>
     
          {data.map(note => {
            const [transcribe, filePath] = note.body.split('\n');
            const base64Audio = localStorage.getItem(`recording_${note.id}`);
            if (!base64Audio) {
              const audioUrl = `${filePath}`;
            
              fetch(audioUrl)
                .then(response => response.blob())  
                .then(blob => {
                  storeRecordingInLocalStorage(blob, note.id);
                });
            }
            return (
              <div key={note.id} className="table-row">
                 <div className="general-data">
     <div className="data-row">
       <span>NOTE ID</span>
       <span>{note.id}</span>
     </div>
     <div className="data-row">
       <span>TRANSCRIBE</span>
       <button className="action-button" onClick={() => downloadTranscript(transcribe)}>Download Transcript</button>
     
     </div>
     <div className="data-row">
       <span>AUDIO PLAY</span>
       {base64Audio ? (
                    <audio controls>
                      <source src={base64Audio} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <p>Loading...</p>
                  )}

     </div>
     <div className="data-row">
       <span>DATA CREATED</span>
       <span>{new Date(note.createdAt).toLocaleString()}</span>
     </div>
     <div className="data-row">
       <span>DELETE FROM GHL</span>
       <button className="action-button" onClick={() => handleDeleteRow(note.id)}>Delete</button>
     </div>
     

   </div>
              </div>
            );
          })}
    </div>
    
  </div>
  );
}   

function storeRecordingInLocalStorage(blob, id) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const base64String = event.target.result;
    localStorage.setItem(`recording_${id}`, base64String);
  };
  reader.readAsDataURL(blob);
}

export default FetchNote;

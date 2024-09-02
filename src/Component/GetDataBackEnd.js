import React, { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import axios from 'axios';

function GetDataBackEnd({ ContactIdClients, ContactId }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = 'https://med-scribe-backend.onrender.com/asr/transcriptions';
                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios(apiUrl, options);

                if (!response.status === 200) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data = response.data;

                if (Array.isArray(data.contacts)) {
                    setData(data.contacts.filter(item => item.contactId === ContactId));
                } else {
                    throw new Error('Data format is incorrect or contacts array is missing');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [ContactId]);

    const handleDeleteRow = async (id) => {
        const newData = data.filter(item => item.id !== id);
        setData(newData);

        try {
            const response = await fetch(`https://med-scribe-backend.onrender.com/api/deleteRow/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error deleting row from server: ${response.statusText}`);
            }

            console.log(`Row with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting row:', error);
            setError(error);
        }
    };


    const sendToGoHighLevel = (item) => {
        const goHighLevelApiUrl = `https://rest.gohighlevel.com/v1/contacts/${ContactIdClients}/notes/`;

        const body = {
            body: `Transcript: ${item.transcript}\n ${item.recordingUrl}`

        };

        console.log(body.body);

        const options = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlVubEJYYTlrSHIxRjI3VWxZT0tqIiwidmVyc2lvbiI6MSwiaWF0IjoxNzE2NTM4NjYxNjIyLCJzdWIiOiJZdG5JS1p2Yjh5dkNqemZaWlM1OSJ9.QatOP_sYaK8FHJbWlwgrYqeiKFt6x6Pr6IC_1nlBDek' // Replace with actual access token
            },
        };

        fetch(goHighLevelApiUrl, options)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errData => {
                        throw new Error(`Network response was not ok: ${response.statusText} - ${errData}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Successfully sent to Go High Level:', data);
            })
            .catch(error => {
                console.error('Error sending data to Go High Level:', error);
                setError(error);
            });
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

    return (
        <div className="general-data">
            {data.map(item => (
                <div key={item.id} className="table-row">
                    <div className="data-row">
                        <span>CURRENT DATE & TIME</span>
                        <span>{item.dateTime}</span>
                    </div>
                    <div className="data-row">
                        <span>TRANSCRIPT FILE</span>
                        <button class="action-button" onClick={() => downloadTranscript(item.transcript)}>Download Transcript</button>
                    </div>
                    <div className="data-row">
                        <span>AUDIO PLAY</span>
                        <span>
                            <audio controls>
                                <source src={`https://med-scribe-backend.onrender.com/files/${item.filePath}`} type="audio/wav" />
                                Your browser does not support the audio element.
                            </audio>
                        </span>
                    </div>
                    <div className="data-row">
                        <span>DELETE</span>
                        <span> <button class="action-button" onClick={() => handleDeleteRow(item.id)}>Delete</button></span>
                    </div>
                    <div className="data-row">
                        <span>SEND TO GHL</span>
                        <span><button class="action-button" onClick={() => sendToGoHighLevel(item)}>Send to GHL</button></span>
                    </div>

                </div>
            ))}
        </div>
    );
}

export default GetDataBackEnd;

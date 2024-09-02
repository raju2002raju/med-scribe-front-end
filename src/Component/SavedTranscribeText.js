import axios from 'axios';
import { gapi } from 'gapi-script';
import React, { useEffect, useState } from 'react';

const SavedTranscribeText = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = 'http://localhost:8080/save-transcript';
                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios(apiUrl, options);

                if (response.status !== 200) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data = response.data;

                if (Array.isArray(data.contacts)) {
                    setData(data.contacts);
                } else {
                    throw new Error('Data format is incorrect or contacts array is missing');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sendToGoogleDocs = async (title, transcript) => {
        if (!title || !transcript) {
            alert('Please provide both a title and a transcript');
            return;
        }

        try {
            await gapi.auth2.getAuthInstance().signIn();

            const createResponse = await gapi.client.docs.documents.create({
                resource: {
                    title: title
                }
            });

            const documentId = createResponse.result.documentId;

            const requests = [
                {
                    insertText: {
                        location: {
                            index: 1
                        },
                        text: transcript
                    }
                }
            ];

            await gapi.client.docs.documents.batchUpdate({
                documentId: documentId,
                requests: requests
            });

            console.log('Document created and updated with content:', createResponse);
        } catch (error) {
            console.error('Error creating document or signing in:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div>
                <h1>Transcript Saved File</h1>
            </div>

            <table>
                <thead>
                    <tr className="table-row">
                        <th>Index</th>
                        <th>Title</th>
                        <th>Transcript</th>
                        <th>Send to Google Docs</th>
                        <th>Folder</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id} className="table-row">
                            <td>{index + 1}</td>
                            <td>{item.title}</td>
                            <td>{item.transcript}</td>
                            <td>
                                <button onClick={() => sendToGoogleDocs(item.title, item.transcript)}>Send to GoogleDocs</button>
                            </td>
                            <td>{item.folder}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SavedTranscribeText;

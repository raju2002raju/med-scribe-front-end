import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Recorder from './Recorder';
import { gapi } from 'gapi-script';
import Setting from './Setting';
import SoundWave from './SoundWave/SoundWave';



let gumStream = null;
let recorder = null;
let audioContext = null;

const CLIENT_ID = '223098918914-7rl4egn7ggo14994bkga1r42qarf20jv.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCS25pGWxdakVGza8KU6jFGxxuvGL8rWQU';
const DISCOVERY_DOCS = ["https://docs.googleapis.com/$discovery/rest?version=v1"];
const SCOPES = "https://www.googleapis.com/auth/documents";

function TranscribeAi() {
    const [isRecording, setIsRecording] = useState(false);
    const [isStartRecording, setIsStartRecording] = useState(false);
    const [transcripts, setTranscripts] = useState([]);
    const [status, setStatus] = useState(true);
    const [transcript, setTranscript] = useState('');
    const [rewrittenTranscript, setRewrittenTranscript] = useState('');
    const [loadingStep, setLoadingStep] = useState(0);
    const [folders, setFolders] = useState([]);
    const [editedTranscript, setEditedTranscript] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [title, setTitle] = useState('');
    const [isOpen, setIsOpen ] = useState();
   const [isOpenTitle, setIsOpenTitle] = useState();
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);

    const handleEditClick = (index) => {
        setEditIndex(index);
        setEditedTranscript(transcripts[index].transcript);
    };


    const handleSaveEdit = () => {
        const updatedTranscripts = [...transcripts];
        updatedTranscripts[editIndex].transcript = editedTranscript;
        setTranscripts(updatedTranscripts);
        setEditIndex(null);
    };

    const rewriteCombinedTranscripts = () => {
        const combinedTranscripts = transcripts.map(res => res.transcript).join('\n');
        rewriteTranscript(combinedTranscripts);
    };

    useEffect(() => {
        const savedTranscript = localStorage.getItem('rewrittenTranscript');
        if (savedTranscript) {
            setRewrittenTranscript(savedTranscript);
        }

        const savedFolders = localStorage.getItem('folders');
        if (savedFolders) {
            setFolders(JSON.parse(savedFolders));
        }

        const initClient = () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            });
        };

        gapi.load('client:auth2', initClient);

        return () => {
            if (recorder && recorder.recording) {
                recorder.stop();
            }
            if (gumStream) {
                gumStream.getAudioTracks()[0].stop();
            }
        };
    }, []);

    const startRecording = async () => {
        setIsRecording(true);
        let constraints = { audio: true, video: false };

        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            gumStream = stream;
            let input = audioContext.createMediaStreamSource(stream)
                ;
            recorder = new Recorder(input, { numChannels: 1 });
            recorder.record();
        } catch (err) {
            console.error("Error getting user media:", err);
        }
    };

    const stopRecording = async () => {
        setIsRecording(false);
        setLoadingStep(1);
        try {
            recorder.stop();
            gumStream.getAudioTracks()[0].stop();
            recorder.exportWAV(onStop);
        } catch (err) {
            console.error("Error stopping recording:", err);
            setLoadingStep(0);
        }
    };

    const onStop = (blob) => {
        let data = new FormData();
        data.append('wavfile', blob, "recording.wav");
        const config = { headers: { 'content-type': 'multipart/form-data' } };
        axios.post('http://localhost:8080/asr', data, config)
            .then(response => {
                console.log("File uploaded successfully:", response.data);
                setLoadingStep(2);
                setTranscript(response.data.transcript);
                if (response?.data) setIsStartRecording(true)
                // rewriteTranscript(response.data.transcript);
            })
            .catch(error => {
                console.error("Error uploading file:", error);
                setLoadingStep(0);
            });
    };

    const rewriteTranscript = (transcript) => {
        setLoadingStep(3);
        axios.post('http://localhost:8080/rewrite-transcript', { transcript })
            .then(response => {
                setRewrittenTranscript(response.data.rewritten);

                setLoadingStep(0);
                setStatus(false);

            })
            .catch(error => {
                console.error("Error rewriting transcript:", error);
                setLoadingStep(0);
            });
    };

    const handleCopyClick = (text) => {
        if (text) {
            console.log(text)
            navigator.clipboard.writeText(text).then(() => {
                alert('Text copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        } else {
            alert('No text to copy');
        }
    };


    const handleShowAddMore = () => {
        const newTranscript = { title: '', transcript: transcript };
        setTranscripts([...transcripts, newTranscript]);
    };


    const sendToGoogleDocs = async () => {
        if (! title, !rewrittenTranscript) {
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
                        text: rewrittenTranscript
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

    const handleSettingClick = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const handleStart = () => {
    setIsRecording(true);
  };

  const handleStop = () => {
    setIsRecording(false);
  };

  const handleReset = () => {
    setIsRecording(false);
    setTime(0);
  };

  
  const handlePopup = () => {
    setIsOpenTitle(!isOpen);
};

const saveClosePopup = () => {
    setIsOpenTitle(false);
};

    return (
        <>
            <div style={{ display: 'flex', gap:'40px' }}>
            <div className='setting_popup_Container'>
                <img src='./Images/setting.png'style={{width:'60px,'}}  onClick={handleSettingClick}  alt='setting'/>
                <img src='./Images/audio_play.png'style={{width:'60px,'}}  alt='audio Play'/>
                <img src='./Images/speaker.png'style={{width:'60px,'}}  alt='Speaker'/>
                <img src='./Images/Vector.png' style={{width:'60px,'}} alt='Vector'/>
                
            </div>
                <div>

                    <div className='popup-container2'>
                    {isRecording && (
                            <>
                                <div className='timer'>{new Date(time * 1000).toISOString().substr(11, 8)}</div>
                               <SoundWave />
                            </>
                        )}
                        {!status && (
                            <>
                                <div style={{ marginBottom: '15px' }}>
                                    <div>
                                        <h3>Original Text:</h3>
                                        <p>{transcript}</p>
                                    </div>
                                </div>
                                <hr />
                            </>
                        )}
                        <div>
                            {status ?
                                <>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop:'30px' }}>
                                            <img src='./Images/mic_Button.png' onClick={() => {startRecording(); handleStart();}} type="button" alt="Start recording" />
                                        </div>
                                        <div className='TranscribeAI_icons'>
                                            <div style={{ cursor: 'pointer' }} onClick={() => handleCopyClick(transcript)}><img src='./Images/Copy_Button.png' style={{ width: '30px' }} alt='copy icon'></img></div>
                                            <div style={{ cursor: 'pointer' }} onClick={() => { setStatus(false); stopRecording(); handleStop(); }}><img src='./Images/pause_Btn.png' style={{ width: '40px' }} alt="Stop recording" /></div>
                                            <img  src='./Images/Add_button.png' style={{ width: '38px', cursor: 'pointer' }} onClick={handleShowAddMore} alt='Add More Button' />
                                        </div>
                                    </div>

                                </>
                                :
                                <>
                                    <div className='TranscribeAI_icons'>
                                    {isStartRecording ?
                                        <div style={{ cursor: 'pointer' }}><img src='./Images/refresh_icon.png' style={{ width: '30px' }} alt='refresh icon' onClick={() => { setStatus(true); setTranscript(''); handleReset(); }}></img></div>
                                        :
                                        <div style={{ cursor: 'pointer' }}><img src='./Images/refresh_icon.png' style={{ width: '30px' }} alt='refresh icon' onClick={() => { setStatus(true); setTranscript(''); handleReset(); }}></img></div>


                                    }
                                    <div style={{ cursor: 'pointer' }} onClick={() => handleCopyClick(transcript)}><img src='./Images/Copy_button.png' style={{ width: '35px' }} alt='copy icon'></img></div>
                                    <img src='./Images/Add_Button.png' style={{ width: '40px' }} onClick={handleShowAddMore} alt='Add More Button' />
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                </div>

                <div >
                    <div style={{ height: '500px', width:'770px', border: '1px solid #0000001A' }}>
                        <div >
                            <h1 style={{ display: 'flex', justifyContent: 'center' }}>Original Text</h1>
                        </div>
                        <div  style={{ width: '770px', marginRight: '50px' }}>
                            {transcripts.map((entry, index) => (
                                <div key={index}>
                                    {editIndex === index ? (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                                <textarea
                                                    style={{ width: '600px', height: '80px' }}
                                                    type="text"
                                                    value={editedTranscript}
                                                    onChange={(e) => setEditedTranscript(e.target.value)}
                                                />
                                                <button onClick={handleSaveEdit}>Save</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                                <p>{entry.transcript}</p>

                                                <div style={{ width: '80px' }}>
                                                    <img src='./Images/edit_icon.png' style={{ width: '20px', height: '20px' }} onClick={() => handleEditClick(index)} alt='Edit'/>

                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            <hr style={{ marginTop: '30px' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px' }}>
                                <div><button onClick={rewriteCombinedTranscripts} className='savedTocorrectionBtn'>Send to Correction</button></div>
                                <div><img style={{ cursor: 'pointer', width: '40px', color: '#5431DA' }} onClick={() => handleCopyClick(transcripts.map((res) => res.transcript).join('\n'))} src='./Images/Copy-Btn.png' alt='copy icon'></img></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '500px', width:'770px', border: '1px solid #0000001A' }}>
                        <div>
                            <h1 style={{ display: 'flex', justifyContent: 'center' }}>Corrected Text</h1>
                        </div>

                        <div style={{ width: '770px' }}>
                            <div >
                                {rewrittenTranscript.split('\n').map((line, index) => (
                                    <p style={{ marginBottom: '10px' }} key={index}>{line}</p>
                                ))}
                                <hr style={{ marginTop: '30px' }} />
                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around' }}>
                                    <img src='./Images/Copy-Btn.png' onClick={() => handleCopyClick(rewrittenTranscript)} style={{ width: '50px' }} alt='Copy Text' />
                                    <img src='./Images/google_docs_icon.png' onClick={handlePopup} style={{ width: '50px', cursor: 'pointer' }}  alt='Google Docs'/>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {isOpen && (
                <div>
                <Setting/>
            </div>
            )}

            {isOpenTitle && (
                <div className='box'>
                    <div className='saved-cross-icon'>
                        <img src='./Images/cross_icon.png' onClick={saveClosePopup} style={{ width: '20px', cursor: 'pointer' }} />
                    </div>
                    <label>Enter Title Here.....</label>
                    <input type='text' placeholder='Enter title here....' value={title} onChange={(e) => setTitle(e.target.value)} />
                    <button onClick={sendToGoogleDocs} style={{ cursor: 'pointer' }}>Save</button>
                </div>
            )}
        </>
    );
}

export default TranscribeAi;
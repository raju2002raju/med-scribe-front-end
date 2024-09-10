import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Recorder from './Recorder';
import Navbar1 from './Navbar1';

let gumStream = null;
let recorder = null;
let audioContext = null;

function DashboardAi() {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [userData, setUserData] = useState(null);
    const [showUserInfo, setShowUserInfo] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const email = localStorage.getItem('userEmail');
                const response = await axios.get('https://med-scribe-backend.onrender.com/auth/user', { 
                    headers: {
                        'user-email': email 
                    }
                 });
                setUserData(response.data[0]);  
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleOpenChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleSendMessage = async () => {
        if (inputMessage.trim() === '') return;

        setChatMessages((prevMessages) => [
            ...prevMessages,
            { text: inputMessage, isUser: true },
        ]);

        let formData = new FormData();
        formData.append('text', inputMessage);

        try {
            const response = await axios.post(
                'https://med-scribe-backend.onrender.com/auth/chat-process',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            setChatMessages((prevMessages) => [
                ...prevMessages,
                { text: response.data.message, isUser: false },
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle error case
            setChatMessages((prevMessages) => [
                ...prevMessages,
                { text: 'Error: Your api key is not correct please provide me proper api key', isUser: false },
            ]);
        }

        setInputMessage('');
    };

    const startRecording = async () => {
        let constraints = { audio: true, video: false };

        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 16000,
            });
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            gumStream = stream;
            let input = audioContext.createMediaStreamSource(stream);
            recorder = new Recorder(input, { numChannels: 1 });
            recorder.record();
            setIsRecording(true);
        } catch (err) {
            console.error('Error getting user media:', err);
        }
    };

    const stopRecording = async () => {
        setIsLoading(true);
        try {
            recorder.stop();
            gumStream.getAudioTracks()[0].stop();
            recorder.exportWAV(onStop);
            setIsRecording(false);
        } catch (err) {
            console.error('Error stopping recording:', err);
        }
    };

    const onStop = (blob) => {
        let data = new FormData();
        data.append('wavfile', blob, 'recording.wav');
        const config = { headers: { 'content-type': 'multipart/form-data' } };
        axios
            .post('https://med-scribe-backend.onrender.com/asr', data, config)
            .then((response) => {
                playAudio(response.data.mp3Url);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });
    };

    const playAudio = (mp3Url) => {
        if (!mp3Url) {
            console.error('Audio URL is empty or undefined.');
            return;
        }
    
        let audio = new Audio(mp3Url);
    
        audio.oncanplaythrough = () => {
            audio.play().catch((error) => {
                console.error('Error playing audio:', error);
            });
        };
    
        audio.onerror = (error) => {
            console.error('Error loading audio:', error.message, 'URL:', mp3Url);
        };
    };
    

    const handleRecordingToggle = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handlePopupClose = () => {
        setIsChatOpen(false);
    };

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const toggleUserInfo = () => {
        setShowUserInfo(!showUserInfo);
    };

    const handleLogout = async () => {
        try {         
            await axios.post('https://med-scribe-backend.onrender.com/auth/logout'); 
    
            localStorage.removeItem('userEmail'); 
            window.location.href = '/login'; 
        } catch (error) {
            console.error('Error during logout:', error);
       
        }
    };


    return (
        <div className="dashboard">
            <Navbar1 />
            <main>
            <header className="Ai-header">
                    {userData && (
                        <>
                            <img
                                src={userData.profileImage || './Images/Ellipse 232.png'} 
                                alt="Profile"
                                className="profile-pic"
                            />
                            {showUserInfo && (
                                <div className="user-info">
                                    <p>{userData.name}</p>
                                    <p>{userData.email}</p>
                                    <button onClick={handleLogout}>Log Out</button>
                                </div>
                            )}
                        </>
                    )}
                    <img 
                        src={showUserInfo ? "./Images/arrowUp.png" : "./Images/arrowDown.png"} 
                        style={{ width: '30px', cursor: 'pointer' }} 
                        alt="Arrow" 
                        onClick={toggleUserInfo} 
                    />
                </header>

                <div className="content">
                    <div
                        className={`microphone ${isRecording ? 'recording' : ''}`}
                        onClick={handleRecordingToggle}
                    >
                        <img src="./Images/AI-Mic.png" alt="Microphone" className="audio-mic" />
                    </div>
                    <div className="ask-box" onClick={handleOpenChat}>
                        <p>Ask Something....</p>
                    </div>
                    {isChatOpen && (
                        <div className="chat-interface">
                            <div>
                                <img
                                    src="../Images/cross.png"
                                    style={{ width: '30px' }}
                                    onClick={handlePopupClose}
                                    alt="Close"
                                />
                            </div>
                            <div className="chat-messages">
                                {chatMessages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`message ${message.isUser ? 'user' : 'bot'}`}
                                    >
                                        {message.text}
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    placeholder="Type your message..."
                                />
                                <button onClick={handleSendMessage}>Send</button>
                            </div>
                        </div>
                    )}
                    <div className="mobile-audio-blob">
                        <img src="./Images/Layer_1.png" alt="Audio Blob" />
                    </div>
                </div>
                <div className="desktop-audioblob">
                    <img src="./Images/audioblob.png" alt="Audio Blob" className="blob-animation" />
                </div>
            </main>
        </div>
    );
}

export default DashboardAi;

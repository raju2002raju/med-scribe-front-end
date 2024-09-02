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

    useEffect(() => {
        // Fetch user data when component mounts
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/auth/user', {
                    withCredentials: true
                });
                setUserData(response.data);
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
        if (inputMessage.trim() === '') return; // Avoid sending empty messages
    
        // Display the user's message in the chat
        setChatMessages(prevMessages => [
            ...prevMessages, 
            { text: inputMessage, isUser: true }
        ]);
    
        let formData = new FormData();
        formData.append('text', inputMessage);
    
        try {
            const response = await axios.post('http://localhost:8080/auth/chat-process', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            // Display the response from the backend
            setChatMessages(prevMessages => [
                ...prevMessages, 
                { text: response.data.message, isUser: false }
            ]);
        } catch (error) {
            console.error("Error sending message:", error);
            // Handle error case
            setChatMessages(prevMessages => [
                ...prevMessages, 
                { text: "Error: Unable to send message", isUser: false }
            ]);
        }
    
        setInputMessage('');
    };
    

    const startRecording = async () => {
        let constraints = { audio: true, video: false };

        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            gumStream = stream;
            let input = audioContext.createMediaStreamSource(stream);
            recorder = new Recorder(input, { numChannels: 1 });
            recorder.record();
            setIsRecording(true);
        } catch (err) {
            console.error("Error getting user media:", err);
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
            console.error("Error stopping recording:", err);
        }
    };

    const onStop = (blob) => {
        let data = new FormData();
        data.append('wavfile', blob, "recording.wav");
        const config = { headers: { 'content-type': 'multipart/form-data' } };
        axios.post('http://localhost:8080/asr', data, config)
            .then(response => {
                playAudio(response.data.mp3Url); 
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error uploading file:", error);
            });
    };

    const playAudio = (mp3Url) => {
        let audio = new Audio(mp3Url);
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    };

    const handleRecordingToggle = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handlepopupClose = () => {
        setIsChatOpen(false);
    };


    return (
        <div className="dashboard">
            <Navbar1 />
            <main>
            <header className='Ai-header'>
                    {userData && (
                        <>
                            <img 
                                src={userData.profileImage ? `http://localhost:8080${userData.profileImage}` : "./Images/Ellipse 232.png"} 
                                alt="Profile" 
                                className="profile-pic" 
                            />
                            <div className="user-info">
                                <p>{userData.name}</p>
                                <p>{userData.email}</p>
                            </div>
                        </>
                    )}
                    <img src='./Images/arrowDown.png' style={{width:'30px'}} alt="Arrow Down"/>
                </header>
                
                <div className="content">
                    <div className={`microphone ${isRecording ? 'recording' : ''}`} onClick={handleRecordingToggle}>
                        <img src="./Images/AI-Mic.png" alt="Microphone" className='audio-mic' />
                    </div>
                    <div className='ask-box' onClick={handleOpenChat}>
                        <p>Ask Something....</p> 
                    </div>
                    {isChatOpen && (
                        <div className="chat-interface">
                           <div>
                               <img src='../Images/cross.png' style={{width:'30px'}} onClick={handlepopupClose} alt="Close"/>
                            </div>
                            <div className="chat-messages">
                                {chatMessages.map((message, index) => (
                                    <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
                                        {message.text}
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input">
                                <input 
                                    type="text" 
                                    value={inputMessage} 
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Type your message..."
                                />
                                <button onClick={handleSendMessage}>Send</button>
                            </div>
                        </div>
                    )}
                    <div className='mobile-audio-blob'> 
                        <img src='./Images/Layer_1.png' alt="Audio Blob"/>
                    </div>
                </div>
               <div className='desktop-audioblob'>
    <img src='./Images/audioblob.png' alt="Audio Blob" className="blob-animation"/>
</div>

            </main>
        </div>
    );
}

export default DashboardAi;

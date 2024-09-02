import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Recorder from './Recorder';

let gumStream = null;
let recorder = null;
let audioContext = null;
const Loading = () => (
    <div className="loading">
        <div className="spinner"></div>
    </div>
);

function TalkWithAssistant() {
    const [recordings, setRecordings] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
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
        let constraints = {
            audio: true,
            video: false
        };

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
        const newRecording = {
            wavBlob: blob,
            mp3Url: ''
        };

        let formData = new FormData();
        formData.append('wavfile', blob, "recording.wav");

        axios.post('https://med-scribe-backend.onrender.com/asr', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
            setRecordings(prevRecordings => [
                ...prevRecordings,
                { ...newRecording, mp3Url: response.data.mp3Url }
            ]);
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Error uploading file:", error);
            setIsLoading(false);
        });
    };

    const handleRecordingToggle = () => {
        if (isRecording) {
            stopRecording();
            setIsLoading(true);
        } else {
            startRecording();
        }
    };

    return (
        <div className='mainBox'>
            <div className='audioalign'>
                {recordings.map((recording, index) => (
                    <div className='recording-container' key={index}>
                        <div className='recording-left'>
                            <audio controls>
                                <source src={URL.createObjectURL(recording.wavBlob)} type="audio/wav" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                        <div className='recording-right'>
                            {recording.mp3Url && (
                                <audio controls autoPlay>
                                    <source src={recording.mp3Url} type="audio/mp3" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {isLoading && <Loading />}
            {!isLoading && (
                <div className='mic'>
                    <div className={`btn ${isRecording ? 'btn-recording' : ''}`}>
                        <img src='./Images/Mic.png' style={{ height: '50px' }} onClick={handleRecordingToggle} alt="Microphone" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default TalkWithAssistant;

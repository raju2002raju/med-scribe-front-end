import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Recorder from './Recorder';
import moment from 'moment/moment';
import AudioPlayAnimation from './AudioPlayAnimation/AudioPlayAnimation';

let gumStream = null;
let recorder = null;
let audioContext = null;

function RecordingWithAssistent({ contactId, onRecordingStop }) {
    const currentDateTimeRef = useRef(null);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [mp3Url, setMp3Url] = useState('');
    const [isRecording, setIsRecording] = useState(false); 

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
        setIsRecording(true); 
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

            
            currentDateTimeRef.current = moment().format('MMMM Do YYYY, h:mm:ss a');
        } catch (err) {
            console.error("Error getting user media:", err);
        }
    };

    const stopRecording = async () => {
        setIsRecording(false); 
        try {
            recorder.stop();
            gumStream.getAudioTracks()[0].stop();

            recorder.exportWAV(onStop);
        } catch (err) {
            console.error("Error stopping recording:", err);
        }
    };

    const onStop = (blob) => {
        setRecordedBlob(blob);
        let data = new FormData();
        data.append('wavfile', blob, "recording.wav");
        data.append('contactId', contactId);
        data.append('dateTime', currentDateTimeRef.current);
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };
        axios.post('https://med-scribe-backend.onrender.com/asr', data, config)
            .then(response => {
                console.log("File uploaded successfully:", response.data);
                console.log("Contact ID sent to backend:", contactId);
                console.log("Date and Time sent to backend:", currentDateTimeRef.current);
                setMp3Url(response.data.mp3Url);
            })
            .catch(error => {
                console.error("Error uploading file:", error);
            });
    };

    return (
        <div>
            <button onClick={startRecording} type="button">Star t</button>
            <button onClick={stopRecording} type="button">Stop</button>
            {isRecording && (
                <AudioPlayAnimation /> 
            )}
            {recordedBlob && (
                <div>
                    <audio controls>
                        <source src={URL.createObjectURL(recordedBlob)} type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
            {mp3Url && (
                <div>
                    <h3>Response MP3</h3>
                    <audio controls>
                        <source src={mp3Url} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
        </div>
    );
}

export default RecordingWithAssistent;
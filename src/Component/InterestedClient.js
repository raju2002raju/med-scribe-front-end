import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Recorder from './Recorder';
import moment from 'moment/moment';
import SoundWave from './SoundWave/SoundWave';


let gumStream = null;
let recorder = null;
let audioContext = null;

function InterestedClient({ contactId, onClose}) {
    const popupRef = useRef();
    const currentDateTimeRef = useRef(null);
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

    

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
    const startRecording = async () => {
        setIsRecording(true); 
        let constraints = {
            audio: true,
            video: false
        };

        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            console.log("sample rate: " + audioContext.sampleRate);

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log("initializing Recorder.js ...");

            gumStream = stream;

            let input = audioContext.createMediaStreamSource(stream);

            recorder = new Recorder(input, { numChannels: 1 });

            recorder.record();
            console.log("Recording started");

            currentDateTimeRef.current = moment().format('MMMM Do YYYY, h:mm:ss a');
        } catch (err) {
            console.error("Error getting user media:", err);
        }
    };

    const stopRecording = async () => {
        setIsRecording(false); 
        console.log("Stop button clicked");

        try {
            recorder.stop();
            gumStream.getAudioTracks()[0].stop();

            recorder.exportWAV(onStop);
        } catch (err) {
            console.error("Error stopping recording:", err);
        }
    };

    const onStop = (blob) => {
        console.log("Uploading...");
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
            })
            .catch(error => {
                console.error("Error uploading file:", error);
            });
    };

    return (
        <div ref={popupRef} >
            <div className='recording_button_div'>
            <button onClick={startRecording} type="button" className="action-button">Start</button>
            <button onClick={() => {
                stopRecording();
            }} type="button" className="action-button">Stop</button>
            </div>
            {isRecording && <SoundWave /> }
        </div>
    );
}

export default InterestedClient;
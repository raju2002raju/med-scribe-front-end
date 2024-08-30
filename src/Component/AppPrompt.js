import React, { useState} from 'react';
import Prompt from './Prompt';
import CheckAppoinment from './CheckAppoinment';
import TalkWithAssistent from './TalkWithAssistent';


function AppPrompt() {
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [endTimestamp, setEndTimestamp] = useState(null);

  const isWithinOneWeek = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    const oneWeekFromToday = new Date(today.setDate(today.getDate() + 7));
    return selectedDate <= oneWeekFromToday;
  };

  const convertDateTime = (type) => {
    let selectedDate, selectedTime, setTimestamp;
    
    if (type === 'start_time') {
      selectedDate = selectedStartDate;
      selectedTime = selectedStartTime;
      setTimestamp = setStartTimestamp;
    } else if (type === 'end_time') {
      selectedDate = selectedEndDate;
      selectedTime = selectedEndTime;
      setTimestamp = setEndTimestamp;
    } else {
      return;
    }

    if (selectedDate && selectedTime) {
      const dateTimeString = `${selectedDate}T${selectedTime}:00`;
      const timestampValue = Date.parse(dateTimeString);
      setTimestamp(timestampValue);
    } else {
      alert('Please select both date and time');
    }
  };

  return (
    <div>
      <Prompt
        selectedStartDate={selectedStartDate}
        setSelectedStartDate={setSelectedStartDate}
        selectedEndDate={selectedEndDate}
        setSelectedEndDate={setSelectedEndDate}
        selectedStartTime={selectedStartTime}
        setSelectedStartTime={setSelectedStartTime}
        selectedEndTime={selectedEndTime}
        setSelectedEndTime={setSelectedEndTime}
        startTimestamp={startTimestamp}
        setStartTimestamp={setStartTimestamp}
        endTimestamp={endTimestamp}
        setEndTimestamp={setEndTimestamp}
        convertDateTime={convertDateTime}
        isWithinOneWeek={isWithinOneWeek}
      />
      <CheckAppoinment
        startTimestamp={startTimestamp}
        endTimestamp={endTimestamp}
      />
      <TalkWithAssistent/>
    </div>
  );
}

export default AppPrompt;

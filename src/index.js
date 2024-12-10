// src/components/VoiceExcel.js
import React, { useState, useRef, useEffect } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import * as XLSX from 'xlsx';

const VoiceExcel = () => {
  const [data, setData] = useState([]); // To store the parsed Excel data
  const [filteredData, setFilteredData] = useState([]); // For filtered results from voice query
  const fileInputRef = useRef(null); // Reference for file input

  // React Speech Recognition Hook
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // If the browser doesn't support speech recognition, display a message
  if (!browserSupportsSpeechRecognition) {
    return <div>Your browser does not support voice recognition.</div>;
  }

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0]; // Getting the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convert the sheet to JSON
      setData(jsonData); // Save data to state
    };
    reader.readAsBinaryString(file); // Read the file
  };

  // Start listening for voice input
 const startListening = () => {
  resetTranscript(); // Reset any previous transcript
  SpeechRecognition.startListening({ continuous: true }); // Start continuous listening
  };

  // Process voice commands once they are captured
 useEffect(() => {
    if (transcript) {
      handleVoiceCommand(transcript);
    }
  }, [transcript]);

  // Function to handle voice commands (search in the data)
  const handleVoiceCommand = (command) => {
    const query = command.toLowerCase();

    if (query.includes('find')) {
      const term = query.replace('find', '').trim(); // Extract search term
      const results = data.filter((row) => {
        return Object.values(row).some((value) => value.toString().toLowerCase().includes(term));
      });
      setFilteredData(results); // Set filtered data based on voice search
    } else {
      setFilteredData([]); // Clear results if no valid command
    }
  };

};

export default VoiceExcel;

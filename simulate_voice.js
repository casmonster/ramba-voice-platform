import axios from 'axios';

// Replace with your Render URL or localhost:5000
const BACKEND_URL = 'http://localhost:5000'; 

async function simulateCall() {
    console.log('🚀 Simulating an Inbound Call to Ramba Voice...');
    
    try {
        // Step 1: Initial Call Trigger
        const response = await axios.post(`${BACKEND_URL}/voice`, {
            isActive: '1',
            direction: 'Inbound',
            callerNumber: '+250780152723',
            destinationNumber: '+811'
        });
        
        console.log('\n🎙️ AGENT GREETING (XML Response):');
        console.log(response.data);
        
        // Step 2: Simulate Recording Transcription (Triage)
        console.log('\n📋 Simulating Patient Symptoms: "Mfite umuriro n\'inkorora..."');
        const triageResponse = await axios.post(`${BACKEND_URL}/voice/process`, {
            isActive: '1',
            recorderUrl: 'https://example.com/mock-recording.wav',
            transcription: 'Mfite umuriro mwinshi n\'inkorora ikaze.' // "I have high fever and severe cough"
        });

        console.log('\n🩺 AI TRIAGE RESPONSE:');
        console.log(triageResponse.data);
        
    } catch (error) {
        console.error('❌ Simulation Failed!');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
            console.error('Is the server running? Run "npm start" in another terminal!');
        }
    }
}

simulateCall();

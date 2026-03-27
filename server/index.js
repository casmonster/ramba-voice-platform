const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the React app in production
app.use(express.static(path.join(__dirname, '../dist')));

// Africa's Talking Configuration
const credentials = {
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME,
};
const AT = require('africastalking')(credentials);
const voice = AT.VOICE;
const sms = AT.SMS;
const { performTriage } = require('./services/gemini');

// Global state for demonstration (In production, use Redis/DB)
let liveCalls = [];

// --- Webhooks ---

/**
 * USSD Callback: *811#
 * Handles the initial menu for patients
 */
app.post('/ussd', (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    let response = "";

    if (text === "") {
        // Main menu
        response = `CON Welcome to Ramba Voice
1. Register for triage call
2. Emergency ambulance (SAMU)
3. Check appointment status`;
    } else if (text === "1") {
        // Trigger a fake callback or register user
        response = `END A Ramba Agent will call you back immediately on ${phoneNumber} for your triage. Murakoze.`;
        // In a real app, you'd trigger a voice.call() here
    } else if (text === "2") {
        response = `END Requesting SAMU Emergency Dispatch to your location. Stay on the line.`;
        // Logic to trigger SMS alert with location
    } else {
        response = `END Thank you for using Ramba Voice.`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

/**
 * Voice Callback
 * Handles incoming calls from patients
 */
app.post('/voice', (req, res) => {
    const { isActive, sessionId, direction, callerNumber } = req.body;

    // AT Voice Response (XML format)
    let response = "";

    if (isActive === "1") {
        // Initial greeting and recording for Gemini to process
        response = `<?xml version="1.0" encoding="UTF-8"?>
            <Response>
                <Say voice="woman" playBeep="true">Bikaze kuri Ramba Voice. Tuvugishe ubusobanuro bw'uburwayi bwawe mu Kinyarwanda. (Welcome to Ramba Voice. Tell us about your symptoms in Kinyarwanda.)</Say>
                <Record finishOnKey="#" maxLength="60" trimSilence="true" playBeep="true" callbackUrl="${process.env.BACKEND_URL}/voice/process" />
            </Response>`;
    } else {
        response = `<Response><Say>Murakoze, umunsi mwiza.</Say></Response>`;
    }

    res.send(response);
});

/**
 * Process Recording
 * This is where Gemini analyzes the transcript
 */
app.post('/voice/process', async (req, res) => {
    const { recordingUrl, callerNumber } = req.body;
    
    // In a real scenario, we'd transcribe the audio first (e.g. using Whisper or AT Speech-to-Text)
    // For this demo, we simulate a transcript based on keywords or a placeholder.
    const mockTranscript = "Mfite umuriro mwinshi kandi ndababara cyane mu mutwe."; // "I have high fever and severe headache."
    
    const triageResult = await performTriage(mockTranscript);
    
    // Update live dashboard state
    const callStatus = {
        id: Date.now(),
        number: callerNumber,
        type: 'Voice',
        status: triageResult.suggested_action,
        confidence: triageResult.confidence,
        summary: triageResult.kinyarwanda_summary,
        time: new Date().toLocaleTimeString()
    };
    liveCalls.unshift(callStatus);

    // Automation: Dispatch / Alert
    if (triageResult.suggested_action === "SAMU") {
        await sms.send({
            to: ['+250780152723'], // User's number from request for demo
            message: `[RAMBA ALERT] EMERGENCY! SAMU Ambulance dispatched to caller ${callerNumber}. GPS Coordinates: -1.9441, 30.0619`
        });
    } else if (triageResult.suggested_action === "REFERRAL") {
        await sms.send({
            to: [callerNumber],
            message: `[Ramba Voice] Triage complete. Referral sent to nearest Health Centre. Please visit within 24 hours.`
        });
    }

    const response = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Say>Triage yarangiye. Igisubizo mu kanya kuri SMS. Murakoze.</Say>
        </Response>`;
    
    res.send(response);
});

// API for Dashboard
app.get('/api/status', (req, res) => {
    res.json({
        totalCalls: liveCalls.length,
        liveCalls: liveCalls.slice(0, 10), // Return last 10
        emergencyActive: liveCalls.some(c => c.status === "SAMU")
    });
});

// Catch-all to serve React's index.html for any other route
app.get('(.*)', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Ramba Backend running on port ${PORT}`);
});

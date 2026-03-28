const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// --- Webhooks & API ---
// IMPORTANT: These must come BEFORE static file serving to avoid being caught by the SPA catch-all

/**
 * Diagnostic GET route for USSD
 */
app.get('/ussd', (req, res) => {
    console.log('Diagnostic GET request to /ussd');
    res.send('RAMBA USSD Endpoint is ACTIVE. Please Use POST for Africa\'s Talking.');
});

/**
 * USSD Callback: *811#
 */
app.post('/ussd', (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    console.log(`USSD Request | Session: ${sessionId} | Number: ${phoneNumber} | Text: "${text}"`);

    let response = "";
    if (text === "") {
        response = `CON Welcome to Ramba Voice
1. Register for triage call
2. Emergency ambulance (SAMU)
3. Check appointment status`;
    } else if (text === "1") {
        response = `END A Ramba Agent will call you back immediately on ${phoneNumber} for your triage. Murakoze.`;
    } else if (text === "2") {
        response = `END Requesting SAMU Emergency Dispatch to your location. Stay on the line.`;
    } else {
        response = `END Thank you for using Ramba Voice.`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

/**
 * Voice Callback
 */
app.post('/voice', (req, res) => {
    const { isActive, sessionId, direction, callerNumber } = req.body;
    console.log(`Voice Request | Session: ${sessionId} | From: ${callerNumber} | Active: ${isActive}`);

    let response = "";
    if (isActive === "1") {
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

app.post('/voice/process', async (req, res) => {
    const { recordingUrl, callerNumber } = req.body;
    console.log(`Processing Voice Recording from ${callerNumber} | URL: ${recordingUrl}`);
    
    const mockTranscript = "Mfite umuriro mwinshi kandi ndababara cyane mu mutwe.";
    const triageResult = await performTriage(mockTranscript);
    
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

    if (triageResult.suggested_action === "SAMU") {
        await sms.send({
            to: ['+250780152723'],
            message: `[RAMBA ALERT] EMERGENCY! SAMU Ambulance dispatched to caller ${callerNumber}. GPS Coordinates: -1.9441, 30.0619`
        });
    }

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Say>Triage yarangiye. Igisubizo mu kanya kuri SMS. Murakoze.</Say>
        </Response>`);
});

app.get('/api/status', (req, res) => {
    res.json({
        totalCalls: liveCalls.length,
        liveCalls: liveCalls.slice(0, 10),
        emergencyActive: liveCalls.some(c => c.status === "SAMU")
    });
});

// --- Static Files & SPA Routing ---

// Serve static files from the React app in production
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback: serve React's index.html for any unmatched routes (SPA support)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Ramba Backend running on port ${PORT}`);
});

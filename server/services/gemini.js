const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Perform triage on a transcript
 * Returns { is_emergency, kinyarwanda_summary, confidence, suggested_action }
 */
async function performTriage(transcript) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are a medical triage assistant for the Ramba Voice Platform in Rwanda.
    Analyze the following patient transcript (which might be in Kinyarwanda or English).
    
    Transcript: "${transcript}"

    Tasks:
    1. Identify if it is a life-threatening emergency (E.g. heart attack, severe bleeding, unconscious).
    2. Provide a short summary of the symptoms in Kinyarwanda.
    3. Determine the 'confidence' level (0-100) of your interpretation.
    4. Output ONLY a JSON object with these keys: 
       "is_emergency" (boolean), 
       "kinyarwanda_summary" (string), 
       "confidence" (number), 
       "suggested_action" (one of: "SAMU", "REFERRAL", "HANDOFF")

    Rules for suggested_action:
    - If confidence < 75, set action to "HANDOFF".
    - If is_emergency is true, set action to "SAMU".
    - Otherwise, set action to "REFERRAL".
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonStr = text.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Triage Error:", error);
        return { is_emergency: false, confidence: 0, suggested_action: "HANDOFF" };
    }
}

/**
 * Get Medical Advice (RAG)
 * Uses a knowledge base and Gemini to provide reliable health info.
 */
async function getMedicalAdvice(userQuery) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Load RAG Knowledge Base
    const knowledgePath = path.join(__dirname, 'rag_knowledge.json');
    let knowledgeBase = { protocols: {} };
    try {
        if (fs.existsSync(knowledgePath)) {
            knowledgeBase = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
        }
    } catch (e) {
        console.error("Failed to load knowledge base:", e);
    }

    const prompt = `
    You are Dr. Ramba, a professional AI Health Assistant for the Ramba Voice Platform in Rwanda.
    Your goal is to provide accurate, helpful, and culturally appropriate health advice.
    
    KNOWLEDGE BASE (RAG):
    ${JSON.stringify(knowledgeBase.protocols, null, 2)}
    
    USER QUERY: "${userQuery}"
    
    INSTRUCTIONS:
    1. Detect if the User Query is in Kinyarwanda or English.
    2. Respond in the SAME LANGUAGE as the User Query.
    3. Use the KNOWLEDGE BASE above if the topic is mentioned. If it's not in the knowledge base, provide general, safe, and professional first-aid advice.
    4. Always advise the user to visit a health centre if symptoms persist.
    5. Output ONLY a clean JSON object with:
       "language" (string: "Kinyarwanda" or "English"),
       "advice" (string: your professional response),
       "confidence" (number: 0-100),
       "is_emergency" (boolean: true if life-threatening)
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Raw Gemini Response:", text);

        // Robust JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }
        
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Gemini Advice Error:", error);
        return { 
            language: "English", 
            advice: `Error: ${error.message}. Please visit your nearest health centre if you are feeling unwell.`,
            confidence: 0,
            is_emergency: false
        };
    }
}

module.exports = { performTriage, getMedicalAdvice };

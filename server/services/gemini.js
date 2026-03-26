const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Perform triage on a transcript
 * Returns { level, action, confidence, kinyarwanda_summary }
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
        // Clean up markdown code blocks if Gemini includes them
        const jsonStr = text.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Triage Error:", error);
        return { is_emergency: false, confidence: 0, suggested_action: "HANDOFF" };
    }
}

module.exports = { performTriage };

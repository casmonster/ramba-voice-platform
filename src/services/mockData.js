// Mock Data Engine for Ramba Voice Platform
// Designed to be easily swappable with Firebase Firestore

const RWANDA_DISTRICTS = ['Gasabo', 'Kicukiro', 'Nyarugenge', 'Rubavu', 'Musanze', 'Huye', 'Bugesera', 'Kayonza', 'Nyagatare'];

// Generate 200 mock calls
const generateCalls = () => {
  const calls = [];
  const now = new Date();
  for (let i = 0; i < 200; i++) {
    const timeOffset = Math.floor(Math.random() * 24 * 60 * 60 * 1000); // Past 24 hours
    calls.push({
      id: `call-${1000 + i}`,
      timestamp: new Date(now - timeOffset).toISOString(),
      district: RWANDA_DISTRICTS[Math.floor(Math.random() * RWANDA_DISTRICTS.length)],
      duration: Math.floor(Math.random() * 90) + 15, // 15s to 105s
      aiConfidence: Math.floor(Math.random() * 30) + 70, // 70% to 100%
      outcome: Math.random() > 0.85 ? 'EMERGENCY' : (Math.random() > 0.5 ? 'REFERRAL' : 'RESOLVED'),
      symptoms: ['Fever', 'Cough', 'Breathing difficulty', 'Bleeding', 'Pain'][Math.floor(Math.random() * 5)]
    });
  }
  return calls.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Generate 71 recent emergency alerts
const generateEmergencies = () => {
  const emergencies = [];
  const now = new Date();
  for (let i = 0; i < 71; i++) {
    const timeOffset = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Past 7 days
    emergencies.push({
      id: `emg-${5000 + i}`,
      timestamp: new Date(now - timeOffset).toISOString(),
      district: RWANDA_DISTRICTS[Math.floor(Math.random() * RWANDA_DISTRICTS.length)],
      patientPhone: `+250 788 000 ${String(100 + i).slice(-3)}`,
      condition: ['Severe Bleeding', 'Unconscious', 'Respiratory Failure', 'Maternal Complication'][Math.floor(Math.random() * 4)],
      status: Math.random() > 0.3 ? 'DISPATCHED' : 'RESOLVED',
      responseMinutes: Math.floor(Math.random() * 15) + 5,
      samuUnit: `Unit-${Math.floor(Math.random() * 15) + 1}`
    });
  }
  return emergencies.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Generate 8-week trend data for Disease Surveillance
const generateDiseaseTrends = () => {
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
  return weeks.map(week => ({
    name: week,
    malaria: Math.floor(Math.random() * 50) + 20,
    respiratory: Math.floor(Math.random() * 80) + 40,
    maternal: Math.floor(Math.random() * 15) + 5,
  }));
};

export const MOCK_DB = {
  calls: generateCalls(),
  emergencies: generateEmergencies(),
  diseaseTrends: generateDiseaseTrends()
};

// In a real implementation with Firestore, we would export standard async fetchers:
// export const fetchCalls = async () => { ... }

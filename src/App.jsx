import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PlatformOverview from './pages/PlatformOverview';
import Architecture from './pages/Architecture';
import PatientJourney from './pages/PatientJourney';
import LiveDashboard from './pages/LiveDashboard';
import Surveillance from './pages/DiseaseSurveillance';
import HealthAssistant from './pages/HealthAssistant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<PlatformOverview />} />
          <Route path="architecture" element={<Architecture />} />
          <Route path="journey" element={<PatientJourney />} />
          <Route path="dashboard" element={<LiveDashboard />} />
          <Route path="surveillance" element={<Surveillance />} />
          <Route path="health-assistant" element={<HealthAssistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

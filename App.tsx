import React, { useState } from 'react';
import { GameStage, UserProfile, FlightPlan, MissionAnalysis } from './types';
import { HUDLayout } from './components/HUDLayout';
import { TarmacScreen } from './components/screens/IntroScreen'; // Tarmac replaces Intro
import { GangwayScreen } from './components/screens/GangwayScreen'; // New
import { FlightPlanScreen } from './components/screens/FlightPlanScreen'; // Conceptually Aircraft
import { CockpitScreen } from './components/screens/CockpitScreen';

function App() {
  const [stage, setStage] = useState<GameStage>(GameStage.TARMAC);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    role: null,
    miles: 0,
    skills: [],
    badges: []
  });
  const [flightPlan, setFlightPlan] = useState<FlightPlan | null>(null);
  const [analysis, setAnalysis] = useState<MissionAnalysis | null>(null);

  // --- Navigation Handlers ---

  const handleTarmacComplete = (partialProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...partialProfile }));
    setStage(GameStage.GANGWAY);
  };

  const handleGangwayUpdate = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleGangwayComplete = () => {
    setStage(GameStage.AIRCRAFT);
  };

  const handleAircraftComplete = (plan: FlightPlan, result: MissionAnalysis) => {
    setFlightPlan(plan);
    setAnalysis(result);
    // Add miles for mission submission
    setProfile(prev => ({ ...prev, miles: prev.miles + 200, badges: [...prev.badges, "MISSION 1"] }));
    setStage(GameStage.COCKPIT);
  };

  const handleReset = () => {
    setStage(GameStage.TARMAC);
    setProfile({ name: '', role: null, miles: 0, skills: [], badges: [] });
    setFlightPlan(null);
    setAnalysis(null);
  };

  return (
    <div className="h-screen w-screen bg-[#050b14] text-white overflow-hidden selection:bg-cyan-500 selection:text-black">
      <HUDLayout 
        currentStage={stage} 
        miles={profile.miles}
      >
        {stage === GameStage.TARMAC && (
          <TarmacScreen onComplete={handleTarmacComplete} />
        )}

        {stage === GameStage.GANGWAY && (
          <GangwayScreen 
            userProfile={profile}
            onUpdateProfile={handleGangwayUpdate}
            onNext={handleGangwayComplete}
          />
        )}
        
        {stage === GameStage.AIRCRAFT && (
          <FlightPlanScreen 
            userProfile={profile}
            onAnalyzeComplete={handleAircraftComplete} 
          />
        )}

        {stage === GameStage.COCKPIT && flightPlan && analysis && (
          <CockpitScreen 
            profile={profile} 
            plan={flightPlan} 
            analysis={analysis}
            onReset={handleReset}
          />
        )}
      </HUDLayout>
    </div>
  );
}

export default App;
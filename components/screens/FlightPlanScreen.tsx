import React, { useState } from 'react';
import { Button } from '../Button';
import { FlightPlan, MissionAnalysis, UserProfile } from '../../types';
import { analyzeFlightPlan } from '../../services/geminiService';
import { Plane, CloudLightning, Loader2, FileText, Lock } from 'lucide-react';

interface FlightPlanScreenProps {
  userProfile: UserProfile;
  onAnalyzeComplete: (plan: FlightPlan, analysis: MissionAnalysis) => void;
}

export const FlightPlanScreen: React.FC<FlightPlanScreenProps> = ({ userProfile, onAnalyzeComplete }) => {
  const [plan, setPlan] = useState<FlightPlan>({ title: '', context: '', constraints: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!plan.title || !plan.context) return;
    setIsAnalyzing(true);
    const analysis = await analyzeFlightPlan(plan, userProfile);
    setIsAnalyzing(false);
    onAnalyzeComplete(plan, analysis);
  };

  if (isAnalyzing) {
      return (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="relative w-32 h-32">
                  <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                  <Plane className="absolute inset-0 m-auto w-10 h-10 text-white animate-pulse" />
              </div>
              <p className="font-arcade text-xl text-cyan-400 animate-pulse">LIAISON TOUR DE CONTRÔLE...</p>
              <p className="font-mono text-slate-400 text-sm">ANALYSE DE COHÉRENCE ET MÉTÉO EN COURS</p>
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col gap-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="flex items-center gap-4 border-b border-cyan-900/50 pb-4">
        <Plane className="w-8 h-8 text-cyan-400" />
        <div>
           <h3 className="text-2xl font-arcade text-white">ACTE 3 : AVION</h3>
           <p className="text-xs font-mono text-cyan-600">ENREGISTREMENT DU PREMIER PLAN DE VOL</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Left: Info Panel */}
         <div className="md:col-span-1 space-y-4">
            <div className="bg-slate-900/50 border border-cyan-900/50 p-4 rounded text-sm text-slate-300">
                <p className="mb-2 font-bold text-cyan-400 uppercase">Rappel Commandant</p>
                <div className="space-y-1 font-mono text-xs">
                    <p>Rôle: <span className="text-white">{userProfile.role}</span></p>
                    <p>Compétences: <span className="text-white">{userProfile.skills.length} modules</span></p>
                </div>
            </div>
            <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded">
                <p className="text-xs text-blue-200 leading-relaxed">
                   <strong>Conseil :</strong> Choisissez une mission simple pour commencer. 
                   L'IA de la Tour vérifiera si elle est réalisable avec votre équipement actuel.
                </p>
            </div>
         </div>

         {/* Right: Form */}
         <div className="md:col-span-2 space-y-4">
            <div className="group relative">
                <div className="absolute left-3 top-3 text-cyan-700"><FileText className="w-5 h-5" /></div>
                <input 
                    type="text" 
                    value={plan.title}
                    onChange={(e) => setPlan({...plan, title: e.target.value})}
                    placeholder="TITRE DE LA MISSION (EX: CHATBOT RH)"
                    className="w-full bg-slate-900/50 border border-cyan-900 text-white pl-10 pr-4 py-4 focus:outline-none focus:border-cyan-400 focus:bg-slate-900/80 font-mono transition-colors"
                />
            </div>

            <textarea 
                value={plan.context}
                onChange={(e) => setPlan({...plan, context: e.target.value})}
                placeholder="CONTEXTE & OBJECTIFS : Pourquoi ce projet ? Quels sont les irritants actuels ?"
                rows={5}
                className="w-full bg-slate-900/50 border border-cyan-900 text-white p-4 focus:outline-none focus:border-cyan-400 font-mono resize-none"
            />

            <div className="group relative">
                <div className="absolute left-3 top-3 text-cyan-700"><Lock className="w-5 h-5" /></div>
                <textarea 
                    value={plan.constraints}
                    onChange={(e) => setPlan({...plan, constraints: e.target.value})}
                    placeholder="CONTRAINTES (Données sensibles, délai, budget...)"
                    rows={3}
                    className="w-full bg-slate-900/50 border border-cyan-900 text-white pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-400 font-mono resize-none"
                />
            </div>
         </div>
      </div>

      <div className="mt-auto flex justify-end pt-6 border-t border-cyan-900/30">
        <Button 
          label="DEMANDER AUTORISATION DÉCOLLAGE" 
          onClick={handleAnalyze}
          disabled={!plan.title || !plan.context}
          variant="primary"
          icon={<CloudLightning />}
        />
      </div>
    </div>
  );
};
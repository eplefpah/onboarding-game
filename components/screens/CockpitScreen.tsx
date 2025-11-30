import React from 'react';
import { UserProfile, MissionAnalysis, FlightPlan } from '../../types';
import { Button } from '../Button';
import { Gauge, CheckCircle, AlertOctagon, RotateCcw, Award } from 'lucide-react';

interface CockpitScreenProps {
  profile: UserProfile;
  plan: FlightPlan;
  analysis: MissionAnalysis;
  onReset: () => void;
}

export const CockpitScreen: React.FC<CockpitScreenProps> = ({ profile, plan, analysis, onReset }) => {
  const getScoreColor = (score: number) => {
      if (score <= 1) return 'bg-green-500';
      if (score === 2) return 'bg-yellow-500';
      return 'bg-red-500';
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-cyan-900/50 pb-4">
        <div className="flex items-center gap-4">
            <Gauge className="w-8 h-8 text-cyan-400" />
            <div>
               <h3 className="text-2xl font-arcade text-white">ACTE 4 : COCKPIT</h3>
               <p className="text-xs font-mono text-cyan-600">SYSTÈMES OPÉRATIONNELS - EN VOL</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
         
         {/* Column 1: Mission Status (Weather) */}
         <div className="bg-slate-900/40 border border-cyan-500/30 rounded-lg p-6 flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-20"><Gauge className="w-24 h-24" /></div>
             <h4 className="font-arcade text-cyan-400 mb-6 tracking-widest text-sm border-b border-cyan-900/50 pb-2">RADAR MÉTÉO</h4>
             
             <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                 {/* Gauge visuals */}
                 <div className="w-full space-y-4">
                     <div>
                         <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                             <span>URGENCE</span>
                             <span>{analysis.urgency}/3</span>
                         </div>
                         <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                             <div className={`h-full ${getScoreColor(analysis.urgency)} transition-all duration-1000`} style={{ width: `${(analysis.urgency/3)*100}%` }}></div>
                         </div>
                     </div>
                     <div>
                         <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                             <span>DIFFICULTÉ</span>
                             <span>{analysis.difficulty}/3</span>
                         </div>
                         <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                             <div className={`h-full ${getScoreColor(analysis.difficulty)} transition-all duration-1000`} style={{ width: `${(analysis.difficulty/3)*100}%` }}></div>
                         </div>
                     </div>
                 </div>

                 <div className="text-center p-4 bg-black/40 border border-slate-700 rounded w-full">
                     <p className="font-arcade text-lg text-white mb-2">{analysis.weatherReport}</p>
                     {analysis.suggestions && analysis.suggestions.length > 0 && (
                         <p className="text-xs text-slate-400 font-mono mt-2 italic">"{analysis.suggestions[0]}"</p>
                     )}
                 </div>
             </div>
         </div>

         {/* Column 2: Flight Data Log */}
         <div className="bg-slate-900/40 border border-cyan-500/30 rounded-lg p-6 flex flex-col font-mono text-sm relative">
             <h4 className="font-arcade text-cyan-400 mb-6 tracking-widest text-sm border-b border-cyan-900/50 pb-2">JOURNAL DE BORD</h4>
             
             <div className="space-y-4 text-slate-300 overflow-y-auto custom-scrollbar">
                 <div className="space-y-1">
                     <span className="text-xs text-cyan-700 uppercase">Mission</span>
                     <p className="text-white font-bold">{plan.title}</p>
                 </div>
                 <div className="space-y-1">
                     <span className="text-xs text-cyan-700 uppercase">Contexte</span>
                     <p className="text-xs leading-relaxed opacity-80">{plan.context}</p>
                 </div>
                 <div className="space-y-1">
                     <span className="text-xs text-cyan-700 uppercase">Décision Tour</span>
                     <div className={`mt-2 p-3 border rounded flex items-center gap-3 ${analysis.approved ? 'border-green-500/50 bg-green-900/20 text-green-200' : 'border-red-500/50 bg-red-900/20 text-red-200'}`}>
                         {analysis.approved ? <CheckCircle className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
                         <span className="font-bold">{analysis.approved ? "VOL AUTORISÉ" : "REVISION REQUISE"}</span>
                     </div>
                 </div>
             </div>
         </div>

         {/* Column 3: Pilot Stats */}
         <div className="bg-slate-900/40 border border-cyan-500/30 rounded-lg p-6 flex flex-col">
             <h4 className="font-arcade text-cyan-400 mb-6 tracking-widest text-sm border-b border-cyan-900/50 pb-2">STATUT ÉQUIPAGE</h4>
             
             <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-800 rounded-full border-2 border-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                     {profile.name.charAt(0)}
                 </div>
                 <div>
                     <div className="text-white font-bold text-lg">{profile.name}</div>
                     <div className="text-cyan-500 text-xs">{profile.role}</div>
                 </div>
             </div>

             <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded border border-slate-700">
                     <span className="text-xs text-slate-400 uppercase">Miles</span>
                     <span className="font-arcade text-yellow-400 text-xl">{profile.miles}</span>
                 </div>
                 
                 <div>
                     <span className="text-xs text-slate-400 uppercase mb-2 block">Badges Acquis</span>
                     <div className="flex flex-wrap gap-2">
                         {profile.badges.map(badge => (
                             <span key={badge} className="px-2 py-1 bg-yellow-900/30 text-yellow-200 border border-yellow-700/50 rounded text-[10px] flex items-center gap-1">
                                 <Award className="w-3 h-3" /> {badge}
                             </span>
                         ))}
                     </div>
                 </div>
             </div>

             <div className="mt-auto">
                <Button 
                    label="NOUVELLE MISSION" 
                    variant="secondary" 
                    icon={<RotateCcw className="w-4 h-4" />}
                    onClick={onReset}
                    className="w-full"
                />
             </div>
         </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Battery, Wifi, Activity, ChevronRight, Hexagon } from 'lucide-react';
import { GameStage } from '../types';

interface HUDLayoutProps {
  children: React.ReactNode;
  currentStage: GameStage;
  miles: number;
}

const STAGES = [GameStage.TARMAC, GameStage.GANGWAY, GameStage.AIRCRAFT, GameStage.COCKPIT];

export const HUDLayout: React.FC<HUDLayoutProps> = ({ children, currentStage, miles }) => {
  const currentStageIndex = STAGES.indexOf(currentStage);

  return (
    <div className="relative min-h-screen w-full bg-[#050b14] flex flex-col p-2 md:p-6 overflow-hidden">
      {/* Background Animated Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)', 
             backgroundSize: '50px 50px',
             transform: 'perspective(500px) rotateX(20deg) scale(1.5)'
           }}>
      </div>
      
      {/* Vignette & Scanlines */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none"></div>
      <div className="scanline"></div>

      {/* Top HUD Bar */}
      <header className="relative z-20 flex flex-col md:flex-row justify-between items-center border-b border-cyan-500/30 pb-4 mb-4 backdrop-blur-sm bg-slate-900/20">
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <div className="relative">
            <div className="w-10 h-10 border border-cyan-500 flex items-center justify-center bg-cyan-900/20 animate-pulse">
              <Hexagon className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400"></div>
          </div>
          <div>
            <h1 className="font-arcade text-xl md:text-2xl text-cyan-400 tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
              REF-IA <span className="text-white text-xs opacity-70 align-top">SYS.v2</span>
            </h1>
            <p className="text-[10px] text-cyan-700 uppercase tracking-[0.2em]">Protocole d'Onboarding Actif</p>
          </div>
        </div>
        
        {/* Phase Progress Bar */}
        <div className="flex items-center gap-2 md:gap-4">
            {STAGES.map((stage, idx) => (
                <div key={stage} className={`flex items-center ${idx <= currentStageIndex ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                    <div className="flex flex-col items-center">
                        <span className={`text-[10px] font-mono mb-1 ${idx === currentStageIndex ? 'text-cyan-300 animate-pulse' : 'text-slate-500'}`}>
                           0{idx + 1}
                        </span>
                        <div className={`h-1 w-8 md:w-16 rounded-full transition-all duration-500 ${
                            idx < currentStageIndex ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 
                            idx === currentStageIndex ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-800'
                        }`} />
                        <span className="hidden md:block text-[8px] mt-1 font-arcade uppercase text-slate-400">{stage}</span>
                    </div>
                    {idx < STAGES.length - 1 && <ChevronRight className="w-3 h-3 text-slate-700 mx-1" />}
                </div>
            ))}
        </div>

        <div className="hidden md:flex items-center gap-6 font-mono text-cyan-600 border-l border-cyan-900/50 pl-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Miles Cumulés</span>
            <span className="text-xl text-yellow-400 font-bold font-arcade drop-shadow-[0_0_5px_rgba(250,204,21,0.6)]">
              {miles.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col border border-cyan-500/20 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        {/* Holographic Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar relative">
           {/* Decorative moving line */}
           <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/20 animate-[scan_3s_linear_infinite] pointer-events-none"></div>
           {children}
        </div>
      </main>

      {/* Bottom HUD Bar */}
      <footer className="relative z-20 mt-2 flex justify-between items-center text-[10px] text-cyan-800 font-mono uppercase tracking-widest">
         <div className="flex gap-4">
            <span className="flex items-center gap-2"><Wifi className="w-3 h-3 text-green-500" /> CONNEXION: SECNUMCLOUD</span>
            <span className="hidden md:inline">LAT: 48.8566 | LON: 2.3522</span>
         </div>
         <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>SYSTÈME NOMINAL</span>
            <Battery className="w-3 h-3 text-green-500" />
         </div>
      </footer>
    </div>
  );
};
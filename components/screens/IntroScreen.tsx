import React, { useState } from 'react';
import { Button } from '../Button';
import { RoleType, UserProfile } from '../../types';
import { User, Shield, Zap, Info } from 'lucide-react';

interface TarmacScreenProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

export const TarmacScreen: React.FC<TarmacScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'WELCOME' | 'IDENTITY'>('WELCOME');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  const roles = [
    {
      type: RoleType.MEDIATOR,
      icon: <User className="w-6 h-6" />,
      desc: "Vous faites le lien entre les experts techniques et les métiers. Diplomatie et pédagogie sont vos armes.",
      stats: { tech: 2, comm: 5 }
    },
    {
      type: RoleType.COORDINATOR,
      icon: <Shield className="w-6 h-6" />,
      desc: "Vous pilotez la stratégie et veillez à la conformité (RGPD, Éthique). Vous gardez le cap.",
      stats: { tech: 3, comm: 4 }
    },
    {
      type: RoleType.EXPERT,
      icon: <Zap className="w-6 h-6" />,
      desc: "Vous maîtrisez la technique. Vous formez les équipes et déployez les modèles.",
      stats: { tech: 5, comm: 2 }
    }
  ];

  if (step === 'WELCOME') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-fadeIn">
        <div className="relative">
          <div className="absolute -inset-10 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
          <h2 className="relative font-arcade text-5xl md:text-7xl text-white drop-shadow-[0_0_15px_rgba(6,182,212,1)]">
            REF-IA
          </h2>
        </div>
        
        <div className="max-w-lg space-y-4">
          <p className="font-mono text-cyan-200 text-lg tracking-[0.2em] uppercase border-b border-cyan-800 pb-4">
            Protocole d'Embarquement
          </p>
          <p className="text-slate-300 leading-relaxed">
            Bienvenue sur le Tarmac. Vous êtes sur le point de prendre vos fonctions de <strong className="text-white">Référent IA</strong>.
            Avant de monter dans l'avion, nous devons établir votre profil de vol.
          </p>
        </div>

        <Button 
          label="COMMENCER L'IDENTIFICATION" 
          variant="primary" 
          onClick={() => setStep('IDENTITY')}
          className="text-lg px-12 py-4 animate-bounce hover:animate-none"
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 max-w-5xl mx-auto animate-slideUp">
      <div className="flex items-center gap-4 border-b border-cyan-900/50 pb-4">
        <div className="p-2 bg-cyan-900/30 rounded border border-cyan-500">
           <Info className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
           <h3 className="text-2xl font-arcade text-white">ACTE 1 : IDENTITÉ</h3>
           <p className="text-xs font-mono text-cyan-600">ENREGISTREMENT AU TERMINAL</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Left: Input */}
        <div className="lg:col-span-1 space-y-6">
           <div>
             <label className="block text-cyan-500 text-xs font-mono mb-2 uppercase tracking-wider">Nom de code (Agent)</label>
             <input 
               type="text" 
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="EX: AGENT SMITH"
               className="w-full bg-slate-900/80 border border-cyan-800 text-cyan-100 px-4 py-4 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] font-arcade tracking-widest transition-all"
             />
           </div>
           
           <div className="bg-slate-800/50 p-4 border border-slate-700 rounded text-xs text-slate-400 font-mono">
              <p>INFO: Le choix du rôle déterminera vos outils de bord et les défis que vous rencontrerez.</p>
           </div>
        </div>

        {/* Right: Role Selection */}
        <div className="lg:col-span-2 space-y-4">
           <label className="block text-cyan-500 text-xs font-mono mb-2 uppercase tracking-wider">Sélectionnez votre Classe</label>
           <div className="grid grid-cols-1 gap-4">
             {roles.map((r) => (
               <button
                 key={r.type}
                 onClick={() => setSelectedRole(r.type)}
                 className={`relative p-6 border text-left group transition-all duration-300 ${
                   selectedRole === r.type 
                     ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                     : 'bg-slate-900/40 border-slate-700 hover:border-cyan-600 hover:bg-slate-800'
                 }`}
               >
                 <div className="flex items-start gap-4">
                   <div className={`p-3 rounded-full ${selectedRole === r.type ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                     {r.icon}
                   </div>
                   <div className="flex-1">
                     <h4 className={`font-arcade text-lg mb-1 ${selectedRole === r.type ? 'text-white' : 'text-slate-300'}`}>
                       {r.type}
                     </h4>
                     <p className="text-sm text-slate-400 font-mono leading-relaxed mb-3">{r.desc}</p>
                     
                     {/* Stats Bars */}
                     <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-cyan-700 uppercase font-bold">
                            <span className="w-10">Tech</span>
                            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500" style={{ width: `${(r.stats.tech / 5) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-cyan-700 uppercase font-bold">
                            <span className="w-10">Comm</span>
                            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${(r.stats.comm / 5) * 100}%` }}></div>
                            </div>
                        </div>
                     </div>
                   </div>
                   {selectedRole === r.type && <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>}
                 </div>
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="mt-auto flex justify-end pt-6 border-t border-cyan-900/30">
        <Button 
          label="VALIDER IDENTITÉ" 
          onClick={() => name && selectedRole && onComplete({ name, role: selectedRole, miles: 100, badges: ["RECRUE"] })}
          disabled={!name || !selectedRole}
          className="w-full md:w-auto"
        />
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Button } from '../Button';
import { RoleType, SKILL_OPTIONS, UserProfile } from '../../types';
import { User, Briefcase, Cpu } from 'lucide-react';

interface PassportScreenProps {
  onComplete: (profile: UserProfile) => void;
}

export const PassportScreen: React.FC<PassportScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < 5) {
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  const handleNext = () => {
    if (name && selectedRole && selectedSkills.length > 0) {
      onComplete({
        name,
        role: selectedRole,
        miles: 0,
        skills: selectedSkills,
        badges: []
      });
    }
  };

  return (
    <div className="h-full flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 border-b border-cyan-900 pb-4">
        <User className="w-8 h-8 text-cyan-400" />
        <h3 className="text-2xl font-arcade text-white">VÉRIFICATION D'IDENTITÉ</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Personal Data */}
        <div className="space-y-6">
          <div className="group">
            <label className="block text-cyan-600 text-xs font-mono mb-2 uppercase tracking-wider">Nom de l'Agent</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="SAISIR IDENTIFIANT"
              className="w-full bg-slate-900/50 border border-cyan-800 text-cyan-100 px-4 py-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] font-mono transition-all"
            />
          </div>

          <div>
            <label className="block text-cyan-600 text-xs font-mono mb-2 uppercase tracking-wider">Sélection du Rôle (Équipage)</label>
            <div className="space-y-3">
              {Object.values(RoleType).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-4 border transition-all duration-300 flex items-center gap-3 ${
                    selectedRole === role 
                      ? 'bg-cyan-900/40 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                      : 'bg-slate-900/30 border-slate-700 text-slate-400 hover:border-cyan-700'
                  }`}
                >
                  <Briefcase className={`w-5 h-5 ${selectedRole === role ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="font-mono text-sm">{role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills */}
        <div>
          <label className="block text-cyan-600 text-xs font-mono mb-2 uppercase tracking-wider">
            Charger Compétences ({selectedSkills.length}/5)
          </label>
          <div className="grid grid-cols-1 gap-3">
            {SKILL_OPTIONS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                disabled={!selectedSkills.includes(skill) && selectedSkills.length >= 5}
                className={`p-3 border text-sm font-mono text-left flex items-center justify-between group transition-all ${
                  selectedSkills.includes(skill)
                    ? 'bg-blue-900/30 border-blue-400 text-blue-100'
                    : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-600'
                } ${!selectedSkills.includes(skill) && selectedSkills.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4" />
                  {skill}
                </div>
                {selectedSkills.includes(skill) && <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_5px_rgba(96,165,250,0.8)]" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex justify-end pt-6 border-t border-cyan-900/30">
        <Button 
          label="Confirmer & Accéder au Tarmac" 
          onClick={handleNext}
          disabled={!name || !selectedRole || selectedSkills.length === 0}
          className={`${(!name || !selectedRole || selectedSkills.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>
    </div>
  );
};
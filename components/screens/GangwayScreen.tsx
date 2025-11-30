import React, { useState } from 'react';
import { Button } from '../Button';
import { QuizQuestion, SKILL_OPTIONS, UserProfile } from '../../types';
import { generateCalibrationQuiz } from '../../services/geminiService';
import { Cpu, BrainCircuit, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

interface GangwayScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
}

export const GangwayScreen: React.FC<GangwayScreenProps> = ({ userProfile, onUpdateProfile, onNext }) => {
  const [phase, setPhase] = useState<'SKILLS' | 'CALIBRATION' | 'RESULTS'>('SKILLS');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < 5) setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const startCalibration = async () => {
    setIsLoading(true);
    onUpdateProfile({ skills: selectedSkills });
    const generatedQuiz = await generateCalibrationQuiz(userProfile.role || "Agent", selectedSkills);
    setQuiz(generatedQuiz);
    setIsLoading(false);
    setPhase('CALIBRATION');
  };

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === quiz[currentQuestionIdx].correctIndex) {
        setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < quiz.length - 1) {
        setCurrentQuestionIdx(currentQuestionIdx + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
    } else {
        setPhase('RESULTS');
        const finalMiles = userProfile.miles + (score * 50) + 50; // Bonus for completion
        onUpdateProfile({ miles: finalMiles, badges: [...userProfile.badges, "CALIBRÉ"] });
    }
  };

  // --- RENDER SKILLS PHASE ---
  if (phase === 'SKILLS') {
    return (
      <div className="h-full flex flex-col gap-6 max-w-4xl mx-auto animate-fadeIn">
        <div className="flex items-center gap-4 border-b border-cyan-900/50 pb-4">
           <Cpu className="w-8 h-8 text-cyan-400" />
           <div>
               <h3 className="text-2xl font-arcade text-white">ACTE 2 : PASSERELLE</h3>
               <p className="text-xs font-mono text-cyan-600">CHARGEMENT DES MODULES DE COMPÉTENCE</p>
           </div>
        </div>

        <div className="bg-slate-900/50 p-4 border border-cyan-500/30 rounded text-sm text-cyan-200 font-mono mb-4">
            Veuillez sélectionner jusqu'à 5 modules pour configurer votre interface neuronale.
            Ces choix influenceront la calibration.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SKILL_OPTIONS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`p-4 border text-sm font-mono text-left flex items-center justify-between group transition-all duration-200 ${
                  selectedSkills.includes(skill)
                    ? 'bg-cyan-900/50 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.2)] scale-[1.02]'
                    : 'bg-slate-900/30 border-slate-700 text-slate-500 hover:border-cyan-700'
                }`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${selectedSkills.includes(skill) ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`}></div>
                   {skill}
                </div>
              </button>
            ))}
        </div>

        <div className="mt-auto flex justify-end pt-6">
            <Button 
                label={isLoading ? "GÉNÉRATION SÉQUENCE..." : "LANCER CALIBRATION"} 
                onClick={startCalibration}
                disabled={selectedSkills.length === 0 || isLoading}
                icon={isLoading ? <Loader2 className="animate-spin" /> : <BrainCircuit />}
            />
        </div>
      </div>
    );
  }

  // --- RENDER CALIBRATION PHASE (QUIZ) ---
  if (phase === 'CALIBRATION') {
      const q = quiz[currentQuestionIdx];
      // Fallback simple si le quiz est vide (erreur API)
      if (!q) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                 <p className="text-red-500 font-mono">Erreur de chargement du module de calibration.</p>
                 <Button label="RETOUR" onClick={() => setPhase('SKILLS')} className="mt-4" />
            </div>
        )
      }

      return (
        <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto animate-fadeIn">
            <div className="w-full bg-slate-900/80 border border-cyan-500 p-8 relative overflow-hidden rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
                    <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${((currentQuestionIdx) / quiz.length) * 100}%` }}></div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <span className="font-arcade text-cyan-400">SÉQUENCE {currentQuestionIdx + 1}/{quiz.length}</span>
                    <span className="font-mono text-xs text-slate-400">CALIBRATION EN COURS...</span>
                </div>

                <h4 className="text-xl md:text-2xl text-white font-bold mb-8 leading-relaxed">
                    {q.question}
                </h4>

                <div className="space-y-4">
                    {q.options.map((opt, idx) => {
                        let statusClass = "border-slate-700 hover:border-cyan-500 hover:bg-slate-800";
                        if (selectedAnswer !== null) {
                            if (idx === q.correctIndex) statusClass = "border-green-500 bg-green-900/30 text-green-100";
                            else if (idx === selectedAnswer) statusClass = "border-red-500 bg-red-900/30 text-red-100";
                            else statusClass = "border-slate-800 opacity-50";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => selectedAnswer === null && handleAnswer(idx)}
                                disabled={selectedAnswer !== null}
                                className={`w-full p-4 border text-left rounded transition-all duration-300 flex items-center justify-between ${statusClass}`}
                            >
                                <span className="font-mono">{opt}</span>
                                {selectedAnswer !== null && idx === q.correctIndex && <CheckCircle className="w-5 h-5 text-green-500" />}
                                {selectedAnswer !== null && idx === selectedAnswer && idx !== q.correctIndex && <XCircle className="w-5 h-5 text-red-500" />}
                            </button>
                        );
                    })}
                </div>

                {showExplanation && (
                    <div className="mt-6 p-4 bg-cyan-900/20 border-l-2 border-cyan-400 animate-slideUp">
                        <p className="text-cyan-200 text-sm font-mono"><span className="font-bold">ANALYSE :</span> {q.explanation}</p>
                        <div className="mt-4 flex justify-end">
                            <Button label={currentQuestionIdx < quiz.length - 1 ? "SUIVANT" : "TERMINER"} onClick={nextQuestion} />
                        </div>
                    </div>
                )}
            </div>
        </div>
      );
  }

  // --- RENDER RESULTS ---
  return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-zoomIn">
          <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center bg-green-900/20 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
              <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          
          <div className="space-y-2">
              <h2 className="font-arcade text-3xl text-white">CALIBRATION RÉUSSIE</h2>
              <p className="font-mono text-cyan-200">SYSTÈMES OPÉRATIONNELS</p>
          </div>

          <div className="grid grid-cols-2 gap-8 py-6">
              <div className="flex flex-col">
                  <span className="text-slate-400 text-xs uppercase">Précision</span>
                  <span className="text-2xl font-bold text-white">{Math.round((score / quiz.length) * 100)}%</span>
              </div>
              <div className="flex flex-col">
                  <span className="text-slate-400 text-xs uppercase">Miles Gagnés</span>
                  <span className="text-2xl font-bold text-yellow-400">+{ (score * 50) + 50 }</span>
              </div>
          </div>

          <Button 
            label="MONTER À BORD (AVION)" 
            variant="primary" 
            onClick={onNext} 
            icon={<ArrowRight />}
            className="px-8"
          />
      </div>
  );
};
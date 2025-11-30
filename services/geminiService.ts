import { GoogleGenAI, Type } from "@google/genai";
import { FlightPlan, MissionAnalysis, QuizQuestion, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-2.5-flash";

export const generateCalibrationQuiz = async (role: string, skills: string[]): Promise<QuizQuestion[]> => {
  const prompt = `
    Génère un quiz de 3 questions (QCM) pour valider les connaissances d'un Référent IA dans l'administration française.
    
    CONTEXTE :
    - Rôle du joueur : ${role}
    - Compétences : ${skills.join(', ')}
    - Ton : Futuriste, "Calibration du système neuronal".
    
    FORMAT JSON ATTENDU :
    Une liste d'objets avec :
    - question (string)
    - options (array of 3 strings)
    - correctIndex (number 0-2)
    - explanation (string courte)
    
    Les questions doivent porter sur l'éthique, le RGPD, ou des cas d'usage IA simples dans le service public.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    throw new Error("Échec génération quiz");
  } catch (error) {
    console.error("Erreur Quiz:", error);
    // Fallback quiz
    return [
      {
        question: "Quelle est la priorité absolue d'un projet IA public ?",
        options: ["La performance pure", "L'explicabilité et la maîtrise", "Le coût réduit"],
        correctIndex: 1,
        explanation: "L'IA de confiance est le pilier de la stratégie nationale."
      },
      {
        question: "Le RGPD s'applique-t-il aux données d'entraînement ?",
        options: ["Oui, toujours", "Non, c'est de l'IA", "Uniquement si elles sont vendues"],
        correctIndex: 0,
        explanation: "Le RGPD s'applique dès qu'il y a données personnelles."
      },
      {
        question: "Quel outil utiliser pour dialoguer avec vos documents ?",
        options: ["Un GAN", "Un RAG (Retrieval Augmented Generation)", "Un SVM"],
        correctIndex: 1,
        explanation: "Le RAG permet de connecter un LLM à vos propres bases documentaires."
      }
    ];
  }
};

export const analyzeFlightPlan = async (plan: FlightPlan, profile: UserProfile): Promise<MissionAnalysis> => {
  
  const prompt = `
    Tu es l'IA "Tour de Contrôle" de RefIA Aviation. Analyse ce plan de vol.

    --- PILOTE ---
    Rôle : ${profile.role}
    Compétences : ${profile.skills.join(', ')}

    --- MISSION ---
    Titre : ${plan.title}
    Contexte : ${plan.context}
    Contraintes : ${plan.constraints}
    
    Consignes :
    1. Vérifie si la mission est cohérente avec le profil (ex: pas de code complexe pour un profil non technique).
    2. Estime l'urgence et la difficulté (0-3).
    3. Donne un feedback métaphorique aviation (ex: "Plan de vol stable", "Turbulences juridiques en vue").

    Réponds en JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urgency: { type: Type.INTEGER },
            difficulty: { type: Type.INTEGER },
            weatherReport: { type: Type.STRING },
            approved: { type: Type.BOOLEAN },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["urgency", "difficulty", "weatherReport", "approved"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MissionAnalysis;
    }
    throw new Error("Pas de réponse de la Tour de Contrôle");
  } catch (error) {
    console.error("Erreur Tour de Contrôle:", error);
    return {
      urgency: 1,
      difficulty: 1,
      weatherReport: "Liaison radio perturbée. Vol à vue autorisé.",
      approved: true,
      suggestions: ["Vérifier manuellement les contraintes"]
    };
  }
};
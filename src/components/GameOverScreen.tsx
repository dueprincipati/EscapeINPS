import React from "react";
import { AlertTriangle, Clock, RotateCcw, ShieldX, HelpCircle } from "lucide-react";
import { playSound } from "../utils/audio";
import { motion } from "motion/react";

interface GameOverScreenProps {
  difficulty: string;
  totalTimeElapsed: number;
  score: number;
  onResetGame: () => void;
}

export default function GameOverScreen({
  difficulty,
  totalTimeElapsed,
  score,
  onResetGame,
}: GameOverScreenProps) {
  
  const handleRetry = () => {
    playSound("success");
    onResetGame();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 animate-fade-in text-neutral-800">
      
      {/* Visual warning icon with alarm ripple */}
      <div className="text-center mb-6 bg-red-650 bg-red-650 bg-[#141414] text-white p-5 border-4 border-[#141414] shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-sm">
        <div className="inline-flex items-center justify-center p-3.5 bg-red-100 rounded-full text-red-800 shadow-inner mb-2 relative">
          <AlertTriangle className="w-10 h-10 text-red-600 animate-bounce" />
          <span className="absolute inset-0 rounded-full border border-red-400 opacity-20 animate-ping"></span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-red-500">
          Tempo Scaduto!
        </h1>
        <p className="text-[10px] md:text-xs font-mono tracking-widest text-[#F27D26] uppercase mt-1 font-bold">
          ⚠️ PRATICA RESPINTA PER VIZIO DI FORMA ⚠️
        </p>
      </div>

      {/* Official styled Rejection Notice Box */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white text-neutral-900 rounded-sm shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6 md:p-8 border-4 border-[#141414] relative overflow-hidden text-left"
      >
        <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
          <ShieldX className="w-48 h-48 text-red-600" />
        </div>

        <h3 className="text-xs font-black font-mono text-red-600 border-b-2 border-red-600 pb-1.5 mb-4 uppercase tracking-wider flex items-center gap-1.5">
          <span>COMUNICAZIONE INPS R-404-PENSION</span>
        </h3>

        <div className="space-y-4 font-mono text-xs text-neutral-800 leading-relaxed">
          <p>
            Gentile Utente, 
            <br />
            Ci rammarica informarla che la sua pratica di pensionamento è stata definitivamente <strong className="text-red-600 underline font-black">ARCHIVIATA CON PREGIUDIZIO ISTITUZIONALE</strong>.
          </p>

          <p>
            A causa del mancato completamento delle manovre logiche nei meandri burocratici entro i 60 minuti regolamentari, il sistema centrale ha provveduto ad applicare gli adeguamenti automatici sull'aspettativa di vita vegetativa del decreto di riforma d'urgenza dell'anno corrente.
          </p>

          <div className="bg-neutral-100 p-4 rounded border-2 border-black space-y-2">
            <span className="text-[10px] text-red-600 block font-bold uppercase tracking-wider">PROVVEDIMENTI DISPOSTI COATTIVAMENTE:</span>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-neutral-700">
              <li>Innalzamento età pensionabile del lavoratore a <strong className="text-neutral-950 font-black">83 anni e 4 mesi utili</strong>.</li>
              <li>Spostamento della tua finestra di decorrenza all'anno <strong className="text-neutral-950 font-black">2070</strong>.</li>
              <li>Annullamento d'ufficio degli anni di contribuzione silenti versati all'estero.</li>
              <li>Sanzione di diniego temporaneo d'uso del Nokia 3310 del nonno.</li>
            </ul>
          </div>

          <p className="text-[9px] text-neutral-500 leading-normal border-t border-black/10 pt-3 italic">
            *I ricorsi cartacei in bollo da 16€ richiedono un preavviso di 18 mesi ed elevata tolleranza alle attese.
          </p>
        </div>

        {/* Scoring list */}
        <div className="grid grid-cols-2 gap-4 border-t-2 border-black pt-4 mt-5 text-[11px] font-mono">
          <div>
            <span className="text-neutral-500 uppercase font-bold text-[9px]">Punteggio ottenuto:</span>
            <div className="text-sm font-black text-[#F27D26]">{score} Punti</div>
          </div>
          <div>
            <span className="text-neutral-500 uppercase font-bold text-[9px]">Stanza di blocco:</span>
            <div className="text-sm font-black text-blue-900">Caveau del futuro</div>
          </div>
        </div>

      </motion.div>

      {/* Recovery triggers */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        
        <button
          onClick={handleRetry}
          className="bg-neutral-900 hover:bg-neutral-805 active:translate-y-0.5 text-white font-mono font-bold text-xs py-3 px-6 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer rounded-sm"
        >
          <RotateCcw className="w-4 h-4 text-amber-300 animate-spin" />
          <span>Fai Ricorso (Ricomincia)</span>
        </button>

      </div>
    </div>
  );
}

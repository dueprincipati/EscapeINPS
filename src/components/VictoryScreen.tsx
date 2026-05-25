import React from "react";
import { Award, Printer, ShieldCheck, Share2, Calendar, User, CheckCircle2, RotateCcw } from "lucide-react";
import { playSound } from "../utils/audio";
import { motion } from "motion/react";

interface VictoryScreenProps {
  difficulty: string;
  timeRemaining: number;
  totalTimeElapsed: number;
  score: number;
  onResetGame: () => void;
}

export default function VictoryScreen({
  difficulty,
  timeRemaining,
  totalTimeElapsed,
  score,
  onResetGame,
}: VictoryScreenProps) {
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minuti e ${secs} secondi`;
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case "burocrate_esperto":
        return "Burocrate Esperto (Livello Rigido)";
      case "quota_100_hero":
        return "Eroe Quota 100 (Livello Massaritmo)";
      default:
        return "Lavoratore Standard";
    }
  };

  const handlePrint = () => {
    playSound("stamp");
    window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 animate-fade-in text-neutral-800">
      
      {/* Visual celebration card */}
      <div className="text-center mb-6 bg-[#0052a3] text-white p-5 border-4 border-[#141414] shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-sm">
        <div className="inline-flex items-center justify-center p-3.5 bg-white text-[#0052a3] border-2 border-black rounded-full shadow-inner mb-2">
          <Award className="w-10 h-10 animate-bounce" />
        </div>
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
          Ce l'hai fatta!
        </h1>
        <p className="text-xs font-mono font-bold tracking-widest text-yellow-300 uppercase mt-1">
          ★ HAI BATTUTO LA BUROCRAZIA ISTITUZIONALE ★
        </p>
      </div>

      {/* Official Certificate Style Div */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        id="printable-certificate"
        className="bg-white rounded-sm shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6 md:p-8 border-4 border-[#141414] relative overflow-hidden text-center text-neutral-800"
      >
        {/* Intricate Watermark Graphic */}
        <div className="absolute inset-0 bg-neutral-503 opacity-[0.02] pointer-events-none flex items-center justify-center">
          <span className="text-[120px] font-black tracking-widest leading-none rotate-12">INPS</span>
        </div>

        {/* Vintage Top Borders */}
        <div className="border-b-2 border-neutral-900 pb-4 mb-5 relative">
          <div className="text-[10px] tracking-wider font-mono text-neutral-500 uppercase font-bold">REPUBBLICA SOCIALE DEL LOGIC-GAME</div>
          <div className="text-lg md:text-xl font-black tracking-widest text-[#0052a3] mt-1 uppercase">
            Istituto Nazionale della Previdenza Logica (INPS)
          </div>
          <div className="text-[9px] text-neutral-400 font-mono mt-0.5">COMANDO TRASFERIMENTO DIRETTO DEL TIMBRO ROSSO APPROVED</div>
        </div>

        {/* Certificate Title */}
        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#F27D26] mb-5 tracking-wide italic">
          Attestato di Pensionamento Anticipato per Meriti Logici
        </h2>

        {/* Recipient Details */}
        <div className="space-y-3 max-w-xl mx-auto text-xs md:text-sm leading-relaxed mb-5 font-serif">
          <p>
            Si certifica che l'insigne <strong className="text-neutral-900 font-black">LAVORATORE ITALIANO</strong>, avendo 
            attraversato con saggezza e coraggio i corridoi cartacei dell'anno '80, recuperato lo SPID sperduto sul Nokia del nonno 
            e domato l'algoritmo del Click Day tramite Solidarietà Intergenerazionale...
          </p>
          <p className="font-bold text-neutral-900 bg-amber-50 py-2.5 rounded border border-[#141414] shadow-inner my-3">
            HA DIRITTO ALL'IMMEDIATO ACCESSO AL CEDOLINO DELLA PENSIONE D'ORO!
          </p>
          <p className="text-[10px] text-neutral-500 font-sans italic leading-tight">
            Nessuna ulteriore revisione delle aspettative di vita sarà applicata, in deroga alle riforme vecchie e future.
          </p>
        </div>

        {/* Bullet Scores with graphic cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 border-t border-dashed border-neutral-200 pt-5 my-5 text-left">
          
          <div className="p-2 bg-neutral-150 bg-[#D1D0CB] border border-black rounded font-sans">
            <span className="text-[8px] text-neutral-500 font-mono uppercase block font-bold">Tempo Rimasto</span>
            <strong className="text-[11.5px] text-neutral-900 font-black block mt-0.5">{formatTime(timeRemaining)}</strong>
          </div>

          <div className="p-2 bg-neutral-150 bg-[#D1D0CB] border border-black rounded font-sans">
            <span className="text-[8px] text-neutral-500 font-mono uppercase block font-bold">Tempo Impiegato</span>
            <strong className="text-[11.5px] text-neutral-900 font-black block mt-0.5">{formatTime(totalTimeElapsed)}</strong>
          </div>

          <div className="p-2 bg-neutral-150 bg-[#D1D0CB] border border-black rounded font-sans">
            <span className="text-[8px] text-neutral-500 font-mono uppercase block font-bold">Livello Rigore</span>
            <strong className="text-[11.5px] text-neutral-900 font-black block mt-0.5">{getDifficultyLabel()}</strong>
          </div>

          <div className="p-2 bg-neutral-150 bg-[#D1D0CB] border border-black rounded font-sans">
            <span className="text-[8px] text-neutral-500 font-mono uppercase block font-bold">Punteggio Previdenza</span>
            <strong className="text-[11.5px] text-amber-800 font-black block mt-0.5">{score} Punti</strong>
          </div>

        </div>

        {/* Stamp Circle graphic bottom-right */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-neutral-200 pt-5">
          <div className="text-left font-serif text-[10px] text-neutral-400">
            <div>Data: 25 Maggio 2026</div>
            <div>Identificativo Pratica: INPS-OK-994322-GOLD</div>
          </div>

          <div className="w-20 h-20 rounded-full border-4 border-dashed border-red-500/80 flex flex-col items-center justify-center rotate-[-12deg] select-none scale-90">
            <span className="text-[8px] font-mono text-red-500 font-black">COMPLETATO</span>
            <span className="text-[9px] font-sans text-red-600 font-black tracking-widest my-0.5">INPS ROMA</span>
            <span className="text-[8px] font-mono text-red-500 font-black">APPROVED 2026</span>
          </div>
        </div>

      </motion.div>

      {/* Footer controls */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 print:hidden">
        
        <button
          onClick={handlePrint}
          className="bg-neutral-900 hover:bg-neutral-805 active:translate-y-0.5 text-white font-mono font-bold text-xs py-3 px-6 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer rounded-sm"
        >
          <Printer className="w-4 h-4 text-amber-300" />
          <span>Stampa Certificato di Fuga</span>
        </button>

        <button
          onClick={() => {
            playSound("click");
            onResetGame();
          }}
          className="bg-white hover:bg-neutral-50 active:translate-y-0.5 text-neutral-900 font-mono font-bold text-xs py-3 px-6 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 cursor-pointer rounded-sm"
        >
          <RotateCcw className="w-4 h-4 text-emerald-600" />
          <span>Gioca Ancora</span>
        </button>

      </div>
    </div>
  );
}

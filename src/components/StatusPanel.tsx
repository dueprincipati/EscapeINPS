import React from "react";
import { Timer, AlertTriangle, HelpCircle, ShieldAlert, Award, RefreshCw } from "lucide-react";
import { playSound } from "../utils/audio";
import { motion, AnimatePresence } from "motion/react";
import { GameState, RoomId } from "../types";

interface StatusPanelProps {
  gameState: GameState;
  onResetGame: () => void;
  onRequestHint: () => void;
  activeHint: string | null;
  onCloseHint: () => void;
}

export default function StatusPanel({
  gameState,
  onResetGame,
  onRequestHint,
  activeHint,
  onCloseHint,
}: StatusPanelProps) {
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyName = () => {
    switch (gameState.difficulty) {
      case "burocrate_esperto":
        return "Burocrate Esperto (Penalità x2)";
      case "quota_100_hero":
        return "Eroe Quota 100 (Super Rapido!)";
      default:
        return "Lavoratore Standard";
    }
  };

  // Fun scroll headlines representing typical bureaucrat ironical announcements
  const headlines = [
    "⚠️ AVVISO: Si ricorda che lo sportello 3 accetta solo moduli cartacei color pesca compilati con penna nera a sfera.",
    "📈 ISTAT: L'aspettativa di vita media sale di 18 mesi per chi consuma caffè alle macchinette dell'ufficio.",
    "💡 INFO: Lo SPID del nonno ha una scadenza imprevedibile. Consigliato l'aggiornamento notturno.",
    "🔥 EXTREME: Click Day per i fondi integrativi previsto tra pochissimo. Allenare i tendini dell'indice.",
    "📚 REGOLAMENTO: Il timbro blu 'Respinto' garantisce un rinvio a giudizio di almeno 180 giorni lavorativi.",
  ];

  const [tickerIndex, setTickerIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % headlines.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-neutral-900 text-white rounded-2xl shadow-xl border-2 border-neutral-800 p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Timer Column / Block */}
        <div className="flex items-center gap-4">
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-center relative shadow-inner">
            <Timer className={`w-8 h-8 text-red-500 ${gameState.timeRemaining < 300 ? "animate-pulse" : ""}`} />
            {gameState.timeRemaining < 300 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
              Tempo Residuo per il Pensionamento
            </div>
            <div className="text-3xl font-black font-mono tracking-widest text-[#22c55e] bg-black/40 px-3 py-1 rounded border border-neutral-800/50 shadow-inner flex items-center gap-1.5 min-w-[120px]">
              <span className="text-red-500 font-bold">{formatTime(gameState.timeRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Dynamic scrolling marquee banner ticker */}
        <div className="flex-1 max-w-md h-11 bg-neutral-950 rounded-xl border border-neutral-800 p-2.5 overflow-hidden flex items-center justify-start">
          <div className="text-xs text-amber-500 font-mono flex items-center gap-2 truncate w-full">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
            <AnimatePresence mode="wait">
              <motion.span
                key={tickerIndex}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="whitespace-normal overflow-hidden select-none"
              >
                {headlines[tickerIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Buttons / Options for support and hints */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRequestHint}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 font-medium py-2.5 px-4 rounded-xl text-xs transition duration-150 cursor-pointer"
            id="btn-request-hint"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Domanda Aiuto al Pensionato saggio</span>
          </button>

          <button
            onClick={() => {
              if (confirm("Vuoi davvero ricominciare da capo e azzerare tutti gli enigmi risolti?")) {
                playSound("click");
                onResetGame();
              }
            }}
            className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700 rounded-xl transition duration-150 cursor-pointer"
            title="Riavvia il gioco"
            id="btn-restart-game"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* active help modal or drop panel */}
      <AnimatePresence>
        {activeHint && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="bg-amber-900/30 border border-amber-800/60 rounded-xl p-4 text-xs md:text-sm text-amber-200 flex items-start gap-3 relative">
              <span className="text-2xl pt-1">👴</span>
              <div className="flex-1">
                <strong className="block text-amber-300 font-semibold mb-1">
                  Umberto, ex-impiegato esperto in coda dal 1993:
                </strong>
                <p className="leading-relaxed">"{activeHint}"</p>
                <div className="text-[10px] text-amber-400 mt-2 italic">
                  *Nota: Umberto consiglia anche di versare sul fondo complementare, non si sa mai...
                </div>
              </div>
              <button
                onClick={onCloseHint}
                className="absolute top-2 right-2 text-amber-400 hover:text-white font-bold font-mono px-1.5 py-0.5"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini notification center for applied time penalties */}
      {gameState.penaltyLogs.length > 0 && (
        <div className="mt-4 border-t border-neutral-800 pt-3">
          <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase block mb-2">
            REGISTRO DISAVVENTURE BUROCRATICHE (PENALITÀ):
          </span>
          <div className="max-h-24 overflow-y-auto space-y-1.5 custom-scrollbar pr-2">
            {gameState.penaltyLogs.map((log) => (
              <div
                key={log.id}
                className="bg-red-950/20 border border-red-950 p-2 rounded-lg flex justify-between items-center text-[11px] text-red-400 text-left font-mono"
              >
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{log.text}</span>
                </div>
                <strong className="text-red-500 shrink-0 ml-2">-{Math.abs(log.timePenalty)}s</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

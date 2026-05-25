import React, { useState, useEffect } from "react";
import { GameState } from "../types";
import { playSound } from "../utils/audio";
import { Cpu, Power, Zap, RefreshCw, KeyRound, CheckCircle, Flame, Users2, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Room3Props {
  gameState: GameState;
  onUpdateState: (updated: Partial<GameState>) => void;
  onApplyPenalty: (message: string, penalty: number) => void;
  onTriggerVictory: () => void;
}

export default function Room3Future({
  gameState,
  onUpdateState,
  onApplyPenalty,
  onTriggerVictory,
}: Room3Props) {
  // Prism directions (0: UP, 90: RIGHT, 180: DOWN, 270: LEFT)
  const [pubPrism, setPubPrism] = useState(0); // target: 90 (RIGHT)
  const [compPrism, setCompPrism] = useState(180); // target: 180 (DOWN)
  const [privPrism, setPrivPrism] = useState(270); // target: 0 (UP)
  const [laserMsg, setLaserMsg] = useState("");

  // Click day Emergency State
  const [clickDayTimer, setClickDayTimer] = useState(120);
  const [btnYoungActive, setBtnYoungActive] = useState(false);
  const [btnElderActive, setBtnElderActive] = useState(false);
  const [passphraseInput, setPassphraseInput] = useState("");
  const [finalSubmitMsg, setFinalSubmitMsg] = useState("");

  // Start Click day timer once laser is aligned
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.room3.laserAligned && !gameState.isCompleted && !gameState.isGameOver) {
      interval = setInterval(() => {
        setClickDayTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            playSound("failure");
            onApplyPenalty("Tempo Click Day Scaduto! I fondi previdenziali si sono prosciugati.", 300);
            alert("⏰ CLICK DAY SCADUTO! Il fondo di riserva nazionale si è esaurito. Il server si è congelato!");
            // Reset click day
            setBtnYoungActive(false);
            setBtnElderActive(false);
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.room3.laserAligned, gameState.isCompleted, gameState.isGameOver]);

  // Handle prism click rotation
  const rotatePrism = (type: "pubblica" | "complementare" | "privato") => {
    playSound("laser");
    if (type === "pubblica") {
      setPubPrism((prev) => (prev + 90) % 360);
    } else if (type === "complementare") {
      setCompPrism((prev) => (prev + 90) % 360);
    } else {
      setPrivPrism((prev) => (prev + 90) % 360);
    }
  };

  // Check alignment
  const handleCheckLaser = () => {
    // Targets: Public = 90 (RIGHT), Comp = 180 (DOWN), Private = 0 (UP)
    if (pubPrism === 90 && compPrism === 180 && privPrism === 0) {
      playSound("success");
      onUpdateState({
        room3: {
          ...gameState.room3,
          laserAligned: true,
        },
      });
      setLaserMsg("🧬 ALLINEAMENTO PERFETTO! Il raggio laser previdenziale supera intatto tutti e tre i pilastri, garantendo un TASSO DI SOSTITUZIONE dell'85%! Allarme Click Day attivato; sbrigati!");
    } else {
      playSound("failure");
      onApplyPenalty("Errore deviazione raggio: dispersione energetica tassi welfare!", 70);
      setLaserMsg("❌ DISPERSIONE! Il raggio laser manca il sensore previdenziale del futuro. Modifica gli angoli dei pilastri per indirizzare la luce.");
    }
  };

  // Solidarity buttons timers to simulate rapid cooperation
  useEffect(() => {
    let dec1: NodeJS.Timeout;
    let dec2: NodeJS.Timeout;

    if (btnYoungActive) {
      dec1 = setTimeout(() => {
        setBtnYoungActive(false);
      }, 5000); // Decays in 5 seconds
    }
    if (btnElderActive) {
      dec2 = setTimeout(() => {
        setBtnElderActive(false);
      }, 5000); // Decays in 5 seconds
    }

    return () => {
      clearTimeout(dec1);
      clearTimeout(dec2);
    };
  }, [btnYoungActive, btnElderActive]);

  const toggleYoung = () => {
    playSound("click");
    setBtnYoungActive(true);
  };

  const toggleElder = () => {
    playSound("click");
    setBtnElderActive(true);
  };

  // Submit final passphrase
  const handleFinalSubmit = () => {
    if (!btnYoungActive || !btnElderActive) {
      playSound("failure");
      setFinalSubmitMsg("❌ ACCESSO NEGATO: Manca la Solidarietà Intergenerazionale! Entrambi i pulsanti dei poli generazionali devono essere caricati attivi SIMULTANEAMENTE.");
      return;
    }

    const cleanPassStr = passphraseInput.toUpperCase().trim();
    if (cleanPassStr === "QUOTA-IDEALE-2026") {
      playSound("success");
      onUpdateState({
        isCompleted: true,
        room3: {
          ...gameState.room3,
          finalPasswordCorrect: true,
          roomCleared: true,
        },
      });
      onTriggerVictory();
    } else {
      playSound("failure");
      onApplyPenalty("Password di sblocco algoritmo errata!", 90);
      setFinalSubmitMsg("❌ ERRORE: Chiave crittografica respinta dall'algoritmo centrale dell'INPS. Riprova! (-90 secondi)");
    }
  };

  const formatClickDayTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-800">
      
      {/* Room header banner */}
      <div className="bg-amber-100 border-l-4 border-amber-600 p-4 rounded-r-xl shadow-sm text-left">
        <h2 className="text-xl font-bold font-sans flex items-center gap-2 text-amber-900">
          <span>Stanza 3: Il Caveau del Contributivo (Il Futuro)</span>
        </h2>
        <p className="text-xs text-amber-800 mt-1">
          Sei penetrato nella camera blindata dei server del futuro! Le luci corrono veloci sulla scheda madre. Devi prima indirizzare i 3 cannocchiali del tasso di sostituzione previdenziale per convogliare la liquidazione, poi cooperare per superare l'implacabile "Click Day".
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Laser grids */}
        <div className="lg:col-span-6 bg-neutral-950 text-white rounded-2xl p-5 border-2 border-neutral-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-300">1. Orientamento Prismi Sostituzione</h3>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900">
                {gameState.room3.laserAligned ? "OK: ALLINEATI" : "ATTESA IMPULSO"}
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 mb-4 text-left">
              Fai clic su ciascun pilastro per ruotare di 90 gradi. Allinea l'energia pubblica, complementare e privata verso il sensore del tasso di sostituzione.
            </p>

            {/* Simulated Grid with lasers */}
            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 grid grid-cols-3 gap-4 h-48 items-center justify-center relative my-4">
              
              {/* Laser Line rendering logic */}
              <div className="absolute top-24 left-4 right-4 h-1 bg-red-600/20 rounded z-0"></div>
              {gameState.room3.laserAligned && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  className="absolute top-[94px] left-[40px] h-2 bg-emerald-500 rounded z-10 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                ></motion.div>
              )}

              {/* Prism 1: Pubblica */}
              <div className="flex flex-col items-center group relative font-sans">
                <span className="text-[9px] font-mono text-neutral-400 uppercase mb-1">P. Pubblica</span>
                <button
                  type="button"
                  onClick={() => rotatePrism("pubblica")}
                  disabled={gameState.room3.laserAligned}
                  className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-700 flex items-center justify-center relative cursor-pointer active:scale-95 transition"
                >
                  <motion.div
                    animate={{ rotate: pubPrism }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-amber-400 font-bold flex flex-col items-center justify-center select-none"
                  >
                    <span className="text-lg leading-none">🚀</span>
                    <span className="text-[10px] font-black leading-none mt-0.5 text-amber-300">↑</span>
                  </motion.div>
                  {/* helper arrows or indicators */}
                  <div className="absolute right-0.5 w-1.5 h-1.5 rounded-full bg-red-500"></div>
                </button>
                <span className="text-[9.5px] font-mono mt-1 font-semibold text-neutral-400">
                  {pubPrism === 0 && "Alto"}
                  {pubPrism === 90 && <span className="text-emerald-400 font-black">Destra (OK)</span>}
                  {pubPrism === 180 && "Basso"}
                  {pubPrism === 270 && "Sinistra"}
                </span>
                {gameState.demoMode && (
                  <button
                    type="button"
                    onClick={() => { playSound("laser"); setPubPrism(90); }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-300 text-black text-[9px] font-mono font-black py-0.5 px-2 rounded border border-black shadow-[1px_1px_rgba(0,0,0,1)] transition cursor-pointer z-50 whitespace-nowrap"
                  >
                    💡 Auto Destra (90°)
                  </button>
                )}
              </div>

              {/* Prism 2: Complementare */}
              <div className="flex flex-col items-center group relative font-sans">
                <span className="text-[9px] font-mono text-neutral-400 uppercase mb-1">P. Integrativa</span>
                <button
                  type="button"
                  onClick={() => rotatePrism("complementare")}
                  disabled={gameState.room3.laserAligned}
                  className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-700 flex items-center justify-center relative cursor-pointer active:scale-95 transition"
                >
                  <motion.div
                    animate={{ rotate: compPrism }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-indigo-400 font-bold flex flex-col items-center justify-center select-none"
                  >
                    <span className="text-lg leading-none">💎</span>
                    <span className="text-[10px] font-black leading-none mt-0.5 text-indigo-300">↑</span>
                  </motion.div>
                  <div className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-red-500"></div>
                </button>
                <span className="text-[9.5px] font-mono mt-1 font-semibold text-neutral-400">
                  {compPrism === 0 && "Alto"}
                  {compPrism === 90 && "Destra"}
                  {compPrism === 180 && <span className="text-emerald-400 font-black">Basso (OK)</span>}
                  {compPrism === 270 && "Sinistra"}
                </span>
                {gameState.demoMode && (
                  <button
                    type="button"
                    onClick={() => { playSound("laser"); setCompPrism(180); }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-300 text-black text-[9px] font-mono font-black py-0.5 px-2 rounded border border-black shadow-[1px_1px_rgba(0,0,0,1)] transition cursor-pointer z-50 whitespace-nowrap"
                  >
                    💡 Auto Basso (180°)
                  </button>
                )}
              </div>

              {/* Prism 3: Privato */}
              <div className="flex flex-col items-center group relative font-sans">
                <span className="text-[9px] font-mono text-neutral-400 uppercase mb-1">Risparmio Priv.</span>
                <button
                  type="button"
                  onClick={() => rotatePrism("privato")}
                  disabled={gameState.room3.laserAligned}
                  className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-700 flex items-center justify-center relative cursor-pointer active:scale-95 transition"
                >
                  <motion.div
                    animate={{ rotate: privPrism }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-emerald-400 font-bold flex flex-col items-center justify-center select-none"
                  >
                    <span className="text-lg leading-none">🛡️</span>
                    <span className="text-[10px] font-black leading-none mt-0.5 text-emerald-300">↑</span>
                  </motion.div>
                  <div className="absolute top-0.5 w-1.5 h-1.5 rounded-full bg-red-400"></div>
                </button>
                <span className="text-[9.5px] font-mono mt-1 font-semibold text-neutral-400">
                  {privPrism === 0 && <span className="text-emerald-400 font-black">Alto (OK)</span>}
                  {privPrism === 90 && "Destra"}
                  {privPrism === 180 && "Basso"}
                  {privPrism === 270 && "Sinistra"}
                </span>
                {gameState.demoMode && (
                  <button
                    type="button"
                    onClick={() => { playSound("laser"); setPrivPrism(0); }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-300 text-black text-[9px] font-mono font-black py-0.5 px-2 rounded border border-black shadow-[1px_1px_rgba(0,0,0,1)] transition cursor-pointer z-50 whitespace-nowrap"
                  >
                    💡 Auto Alto (0°)
                  </button>
                )}
              </div>

            </div>

            {/* Note logic clue */}
            <div className="p-2.5 bg-neutral-900 text-[10px] font-mono border border-neutral-800 text-left rounded leading-relaxed text-neutral-400">
              💡 <strong className="text-white">GUIDA ALLA RIFRAZIONE:</strong>
              I vettori di forza previdenziale si annullano se non guidano il flusso nel percorso canonico:
              La pensione pubblica deve dirigersi a <span className="underline">Destra (90°)</span>, la complementare deve spingersi in <span className="underline">Basso (180°)</span> per raccogliere i frutti, e il risparmio privato deve mirare in <span className="underline">Alto (0°)</span> verso la sicurezza.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800">
            {!gameState.room3.laserAligned ? (
              <button
                type="button"
                onClick={handleCheckLaser}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition active:scale-95"
              >
                <Zap className="w-4 h-4 text-emerald-300" />
                <span>Attiva Allineamento Laser</span>
              </button>
            ) : (
              <div className="bg-emerald-950 p-2.5 rounded-lg border border-emerald-900 border-dashed text-[11px] text-emerald-400 font-mono text-left">
                ✅ SISTEMA DI TRASMISSIONE ATTIVO! Tasso di Sostituzione stabilizzato. Sbloccato il modulo Click Day.
              </div>
            )}

            {laserMsg && (
              <p className="text-[10px] font-mono text-left text-amber-500 mt-2 bg-neutral-900 p-2 border border-neutral-800 rounded">
                {laserMsg}
              </p>
            )}
          </div>
        </div>

        {/* Right column: Click day challenge */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-neutral-100 pb-2">
              <Flame className="w-5 h-5 text-red-600 animate-pulse" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-700">2. Emergenza Click Day</h3>
            </div>

            {!gameState.room3.laserAligned ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed rounded-xl bg-neutral-50 text-neutral-400">
                <Power className="w-8 h-8 text-neutral-300 mb-2" />
                <span className="text-xs font-mono font-bold uppercase">Click Day Bloccato</span>
                <p className="text-[10px] mt-2 max-w-xs leading-relaxed font-sans">
                  Sottofondi server disattivi. È necessario allineare prima il raggio dei 3 Pilastri a sinistra per alimentare la caldaia pensionistica.
                </p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Emergency countdown and warnings */}
                <div className="bg-red-550 bg-red-50 text-red-900 border-2 border-red-500 p-3 rounded-xl flex items-center justify-between font-mono animate-pulse">
                  <div>
                    <span className="text-[9px] block uppercase font-bold text-red-500">FONDI STATALI DISPONIBILI:</span>
                    <span className="text-xs font-black">CALO VELOCE DEI POSTI</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] block uppercase font-bold text-neutral-400">Termine Click-day:</span>
                    <span className="text-xl font-mono font-black text-red-600 bg-red-100/80 px-2.5 rounded">
                      {formatClickDayTime(clickDayTimer)}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-[11px] text-neutral-500 text-left leading-relaxed">
                  Per consolidare i fondi previdenziali, devi caricare la <strong className="text-neutral-900 font-semibold">Solidarietà Intergenerazionale</strong>. Premi entrambi i tasti cooperativi per renderli attivi (ognuno decade dopo 5 s se non lo tiene acceso anche l'altro) e digita la password conclusiva!
                </p>

                {/* Cooperative buttons */}
                <div className="grid grid-cols-2 gap-3 my-3">
                  <button
                    onClick={toggleYoung}
                    className={`p-3.5 rounded-xl border text-center font-bold text-xs transition relative overflow-hidden flex flex-col items-center cursor-pointer ${
                      btnYoungActive
                        ? "bg-indigo-900 text-white border-indigo-500"
                        : "bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    <Users2 className="w-4 h-4 mb-1 text-indigo-400" />
                    <strong>👩‍💻 Lavoratore Giovane</strong>
                    <span className="text-[9px] mt-1 text-center block">
                      {btnYoungActive ? "ATTIVO (Caricato)" : "Premi per Attivare"}
                    </span>
                    {btnYoungActive && (
                      <div className="absolute bottom-0 left-0 h-1 bg-indigo-400 animate-[width-decay_5s_linear_forwards]"></div>
                    )}
                  </button>

                  <button
                    onClick={toggleElder}
                    className={`p-3.5 rounded-xl border text-center font-bold text-xs transition relative overflow-hidden flex flex-col items-center cursor-pointer ${
                      btnElderActive
                        ? "bg-emerald-950 text-white border-emerald-500"
                        : "bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    <Users2 className="w-4 h-4 mb-1 text-emerald-400" />
                    <strong>👴 Pensionato Saggio</strong>
                    <span className="text-[9px] mt-1 text-center block">
                      {btnElderActive ? "ATTIVO (Caricato)" : "Premi per Attivare"}
                    </span>
                    {btnElderActive && (
                      <div className="absolute bottom-0 left-0 h-1 bg-emerald-400 animate-[width-decay_5s_linear_forwards]"></div>
                    )}
                  </button>
                </div>

                {/* Passphrase Entry */}
                <div className="bg-neutral-50 p-4 rounded-sm border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] group relative">
                  <label className="text-xs font-bold text-neutral-800 block mb-2 text-left font-mono">
                    Password finale calcolo Algoritmo (trovata sul cartello):
                  </label>
                  <input
                    type="text"
                    value={passphraseInput}
                    onChange={(e) => setPassphraseInput(e.target.value)}
                    className="w-full text-center border-2 border-black rounded-sm p-3.5 font-mono font-black uppercase tracking-widest text-[#22c55e] bg-white text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                    placeholder="Es: RIFORMA-XXXX-XXXX"
                  />
                  {gameState.demoMode && (
                    <button
                      type="button"
                      onClick={() => { playSound("click"); setPassphraseInput("QUOTA-IDEALE-2026"); }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#22c55e] hover:bg-[#1fae53] text-white text-[10px] font-mono font-black py-1 px-3 rounded border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition cursor-pointer z-50 whitespace-nowrap"
                    >
                      💡 Auto Password: QUOTA-IDEALE-2026
                    </button>
                  )}
                  <div className="text-[10px] text-neutral-500 text-left mt-2 font-mono font-semibold">
                    💡 Un finto appunto sul server dice: "La password è la fusione delle due riforme: QUOTA-IDEALE-2026"
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t">
            {gameState.room3.laserAligned && (
              <button
                onClick={handleFinalSubmit}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <KeyRound className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>INVIA REGISTRAZIONE FINALE CEDOLINO</span>
              </button>
            )}

            {finalSubmitMsg && (
              <p className="text-[10px] font-mono text-left mt-2 leading-relaxed text-red-600 bg-red-50 p-2 border border-red-200 rounded">
                {finalSubmitMsg}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

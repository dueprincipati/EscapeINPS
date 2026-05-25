import React, { useState, useEffect } from "react";
import { GameState, RoomId } from "./types";
import { playSound } from "./utils/audio";
import Introduction from "./components/Introduction";
import StatusPanel from "./components/StatusPanel";
import Room1Bureaucracy from "./components/Room1Bureaucracy";
import Room2Digital from "./components/Room2Digital";
import Room3Future from "./components/Room3Future";
import VictoryScreen from "./components/VictoryScreen";
import GameOverScreen from "./components/GameOverScreen";
import { Coffee, ShieldCheck, Lock, Unlock, HelpCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const INITIAL_GAME_STATE: GameState = {
  isStarted: false,
  isCompleted: false,
  isGameOver: false,
  activeRoomId: 1,
  timeRemaining: 3600, // 60 minutes
  totalTimeElapsed: 0,
  score: 1000,
  difficulty: "standard",
  demoMode: true,
  
  room1: {
    cabinetUnlocked: false,
    bureaucraticKeyCollected: false,
    overlayCollected: false,
    overlayApplied: false,
    cudCodeAttempt: "",
    cudCodeCorrect: false,
    selectedStamp: null,
    stampedDocument: false,
    submittedDocument: null,
    shredderActivated: false,
    roomCleared: false,
  },

  room2: {
    safeUnlocked: false,
    nokiaCollected: false,
    nokiaOn: false,
    spidOtpAttempt: "",
    spidOtpCorrect: false,
    magnets: { eta: 60, contributi: 35 },
    pensamiBalanced: false,
    roomCleared: false,
  },

  room3: {
    prisms: { pubblica: 0, complementare: 180, privato: 270 },
    laserAligned: false,
    clickDayActive: false,
    clickDayTimeLeft: 120,
    buttonSolidarity1: false,
    buttonSolidarity2: false,
    finalPasswordAttempt: "",
    finalPasswordCorrect: false,
    roomCleared: false,
  },

  penaltyLogs: [],
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [activeHint, setActiveHint] = useState<string | null>(null);

  // Countdown timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.isStarted && !gameState.isCompleted && !gameState.isGameOver) {
      timer = setInterval(() => {
        setGameState((prev) => {
          const speedMultiplier = prev.difficulty === "quota_100_hero" ? 1.25 : 1.0;
          const nextTime = prev.timeRemaining - speedMultiplier;
          const updatedScore = Math.max(100, prev.score - 1);
          
          if (nextTime <= 0) {
            clearInterval(timer);
            playSound("failure");
            return {
              ...prev,
              timeRemaining: 0,
              isGameOver: true,
              score: updatedScore,
            };
          }
          return {
            ...prev,
            timeRemaining: nextTime,
            totalTimeElapsed: prev.totalTimeElapsed + 1,
            score: updatedScore,
          };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.isStarted, gameState.isCompleted, gameState.isGameOver]);

  const handleStartGame = (difficulty: "standard" | "burocrate_esperto" | "quota_100_hero") => {
    let initialTime = 3600; // 60 mins standard
    if (difficulty === "burocrate_esperto") {
      initialTime = 3000; // 50 mins
    } else if (difficulty === "quota_100_hero") {
      initialTime = 2400; // 40 mins
    }

    setGameState({
      ...INITIAL_GAME_STATE,
      isStarted: true,
      difficulty,
      timeRemaining: initialTime,
      demoMode: gameState.demoMode,
    });
    setActiveHint(null);
  };

  const handleResetGame = () => {
    setGameState({
      ...INITIAL_GAME_STATE,
      demoMode: gameState.demoMode,
    });
    setActiveHint(null);
  };

  const handleUpdateState = (updated: Partial<GameState>) => {
    setGameState((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleApplyPenalty = (message: string, penaltyInSeconds: number) => {
    playSound("failure");
    const multiplier = gameState.difficulty === "burocrate_esperto" ? 2 : 1;
    const finalPenalty = penaltyInSeconds * multiplier;

    setGameState((prev) => {
      const newTime = Math.max(0, prev.timeRemaining - finalPenalty);
      const logId = Math.random().toString();
      const updatedScore = Math.max(100, prev.score - 100);

      return {
        ...prev,
        timeRemaining: newTime,
        score: updatedScore,
        penaltyLogs: [
          {
            id: logId,
            text: message,
            timePenalty: finalPenalty,
            timestamp: Date.now(),
          },
          ...prev.penaltyLogs,
        ],
      };
    });
  };

  const triggerVictory = () => {
    playSound("success");
    setGameState((prev) => ({
      ...prev,
      isCompleted: true,
    }));
  };

  // Switch Room tabs
  const handleSwitchRoom = (targetRoomId: RoomId) => {
    playSound("click");
    
    // Safety check constraints
    if (targetRoomId === 2 && !gameState.room1.roomCleared) {
      alert("Blocco Burocratico: Non puoi passare alla Transizione Digitale senza prima aver validato e infilato il modulo di pensionamento approvato nella feritoia!");
      return;
    }
    if (targetRoomId === 3 && !gameState.room2.roomCleared) {
      alert("Blocco Tecnologico: Non puoi accedere al Caveau Server prima di aver avviato con successo il simulatore Pensami sul PC dell'ufficio!");
      return;
    }

    setGameState((prev) => ({
      ...prev,
      activeRoomId: targetRoomId,
    }));
    setActiveHint(null);
  };

  // Hint logic generator
  const handleRequestHint = () => {
    playSound("click");
    let hintText = "";
    
    if (gameState.activeRoomId === 1) {
      hintText = "Umberto dice: Per aprire lo schedario, moltiplica gli anni di Mario per 1.5 (18 x 1.5 = 27), quelli di Laura per 2 (12 x 2 = 24) e quelli di Beppe per 1.2 (25 x 1.2 = 30), poi somma i risultati: 27 + 24 + 30 = 81. Prendi la chiave, estrai il foglio lucido e sovrapponeva sul vecchio CUD per scorgere il codice 7492. Inseriscilo sulla tastiera alla porta, timbra il foglio di rosso APPROVED e infilalo nella feritoia!";
    } else if (gameState.activeRoomId === 2) {
      hintText = "Umberto dice: La cassaforte vuole la concatenazione degli anni d'oro scritti nei foglietti: l'anno di fondazione dell'INPS (1898) seguito dall'anno della Legge Fornero (2011). Inserisci 18982011! Accendi il Nokia per l'OTP necessario sul PC per sbloccare la simula. Sul simulatore Pensami, regola l'Età a 62 e i contributi a 41 per completare Quota 103!";
    } else if (gameState.activeRoomId === 3) {
      hintText = "Umberto dice: Nel server del futuro orienta gli angoli! Gira la Pubblica a Destra (90°), la Complementare in Basso (180°) e il Privato in Alto (0°). Per il Click Day schiaccia veloci i due tasti insieme per riempire l'unione intergenerazionale e scrivi velocemente la chiave nel prompt: QUOTA-IDEALE-2026";
    }

    setActiveHint(hintText);
  };

  // Dynamic years calculation and progress
  const getYearsProgress = () => {
    let years = 24.5;
    if (gameState.room1.roomCleared) years = 34.8;
    if (gameState.room2.roomCleared) years = 41.2;
    if (gameState.room3.roomCleared) years = 42.8;
    return years;
  };

  const yearsProgress = getYearsProgress();
  const progressPercent = (yearsProgress / 42.8) * 100;

  const getDifficultyNameSimple = () => {
    switch (gameState.difficulty) {
      case "quota_100_hero":
        return "Eroe Quota 100";
      case "burocrate_esperto":
        return "Burocrate Esperto";
      default:
        return "Lavoratore Standard";
    }
  };

  const formatTimerValue = (seconds: number) => {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-stone-300 py-4 md:py-10 px-2 md:px-4 font-sans flex items-center justify-center transition-colors duration-300">
      
      {/* Container holding the application screens */}
      <div className="w-full max-w-[1180px] min-h-[760px] bg-[#E4E3E0] text-[#141414] flex flex-col overflow-hidden border-4 md:border-8 border-[#141414] shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] md:shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] rounded-lg">
        
        {/* Intro View */}
        {!gameState.isStarted ? (
          <Introduction onStartGame={handleStartGame} />
        ) : gameState.isCompleted ? (
          <VictoryScreen
            difficulty={gameState.difficulty}
            timeRemaining={gameState.timeRemaining}
            totalTimeElapsed={gameState.totalTimeElapsed}
            score={gameState.score}
            onResetGame={handleResetGame}
          />
        ) : gameState.isGameOver ? (
          <GameOverScreen
            difficulty={gameState.difficulty}
            totalTimeElapsed={gameState.totalTimeElapsed}
            score={gameState.score}
            onResetGame={handleResetGame}
          />
        ) : (
          <>
            {/* Header section in retro corporate blue */}
            <header className="bg-[#0052a3] text-white p-3 md:p-4 flex flex-col sm:flex-row justify-between items-center border-b-4 border-[#141414] gap-4">
              <div className="flex flex-col text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">
                  Fuga verso la Pensione
                </h1>
                <span className="text-[10px] md:text-xs font-mono tracking-widest opacity-90 uppercase italic text-[#F27D26] mt-1 block">
                  Sotto-sistema di Gestione Previdenziale v.2.0.26
                </span>
              </div>
              
              <div className="flex gap-4 md:gap-6 items-center">
                <div className="text-center sm:text-right">
                  <div className="text-[9px] uppercase font-bold opacity-80 tracking-wider">Tempo Rimanente</div>
                  <div className="text-2xl md:text-3xl font-mono font-bold leading-none tabular-nums text-yellow-300">
                    {formatTimerValue(gameState.timeRemaining)}
                  </div>
                </div>

                {/* Alarm Badge status lamp */}
                <div className="bg-red-650 bg-red-600 text-white px-3 md:px-4 py-1.5 md:py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                  <span className="text-[8px] font-bold uppercase leading-none">Allerta</span>
                  <span className="text-xs md:text-sm font-black uppercase leading-none mt-0.5">COPERTURA</span>
                </div>
              </div>
            </header>

            {/* Main high-density segmented workspace grid */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
              
              {/* ASIDE 1/4: LEFT COLUMN (INFO & DOSSIER DATA) */}
              <aside className="col-span-1 lg:col-span-3 border-b-4 lg:border-b-0 lg:border-r-4 border-[#141414] flex flex-col p-4 space-y-4 bg-[#D1D0CB]">
                
                {/* Subject Dossier Details */}
                <div>
                  <h2 className="text-xs font-bold uppercase border-b-2 border-black pb-1 mb-2 tracking-wide text-neutral-800">
                    Dati del Soggetto
                  </h2>
                  <div className="space-y-1.5 font-mono text-[11px] text-neutral-900">
                    <div className="flex justify-between">
                      <span className="opacity-70">NOME:</span>
                      <span className="font-bold">ROSSI, MARIO</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">NATO IL:</span>
                      <span className="font-bold">12/05/1984</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">SOCIETÀ:</span>
                      <span className="font-bold text-blue-800">RSSMRA84E12H501Z</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">SCORE:</span>
                      <span className="font-bold text-amber-700">{gameState.score} pt</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">RIGORE:</span>
                      <span className="font-bold text-emerald-800">{getDifficultyNameSimple()}</span>
                    </div>
                  </div>
                </div>

                {/* Modalità Dimostrativa Hover Guide Toggle */}
                <div className="bg-[#facc15]/15 border-2 border-dashed border-[#F27D26] p-2.5 rounded text-left shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-mono font-black text-amber-800">🎓 GUIDA DEMO ATTIVA</span>
                    <input 
                      type="checkbox"
                      checked={gameState.demoMode}
                      onChange={(e) => handleUpdateState({ demoMode: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-[#F27D26]"
                    />
                  </div>
                  <p className="text-[9.5px] text-neutral-700 font-mono leading-tight">
                    {gameState.demoMode 
                      ? "Passa il mouse (Hover) su input ed elementi per svelare subito le soluzioni!" 
                      : "Soluzioni nascoste. Clicca per riattivare le risposte demo."}
                  </p>
                </div>

                {/* Contributions Progress Accumulator */}
                <div>
                  <h2 className="text-xs font-bold uppercase border-b-2 border-black pb-1 mb-2 tracking-wide text-neutral-800">
                    Contributi Accantonati
                  </h2>
                  <div className="h-4 w-full bg-white border border-black mb-1 p-0.5">
                    <div 
                      className="h-full bg-[#F27D26] border-r border-black transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-700 font-semibold">
                    <span>ATTUALI: {yearsProgress.toFixed(1)} ANNI</span>
                    <span>TARGET: 42.8 ANNI</span>
                  </div>
                </div>

                {/* Status annotations, mini tips & warnings */}
                <div className="flex-1 flex flex-col justify-start space-y-2">
                  <div className="p-2 bg-yellow-150 bg-yellow-200 border border-black text-[10px] italic leading-tight text-neutral-800 shadow-sm">
                    "Senza lo SPID del nonno non potrai sbloccare il simulatore 'Pensami'. Cerca la cassaforte nell'armadio metallico."
                  </div>

                  {/* Penalty message logging queue inside dossier aside */}
                  <div className="flex-1 min-h-[120px] max-h-[180px] lg:max-h-full overflow-y-auto bg-white border border-black p-2 rounded-sm text-[10px] space-y-1.5 custom-scrollbar">
                    <div className="font-bold border-b pb-1 mb-1 border-neutral-200 flex justify-between items-center text-[9px] uppercase tracking-wider text-neutral-500">
                      <span>Log Anomalie Previdenziali</span>
                      <span className="text-red-600">({gameState.penaltyLogs.length})</span>
                    </div>
                    
                    {gameState.penaltyLogs.length === 0 ? (
                      <div className="text-neutral-400 italic text-center py-4 font-mono">
                        Nessuna sanzione pendente.
                      </div>
                    ) : (
                      gameState.penaltyLogs.map((log) => (
                        <div key={log.id} className="flex gap-1.5 text-[9px] text-red-800 leading-tight font-mono">
                          <span className="font-bold shrink-0">[⚠️]</span>
                          <div>
                            <span className="font-semibold">{log.text}</span>
                            <span className="text-red-500 font-bold ml-1">-{log.timePenalty}s</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Competent office box details */}
                <div className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] text-left">
                  <div className="text-[9px] font-bold uppercase mb-1 text-neutral-500">Ufficio Competente</div>
                  <div className="text-xs italic font-serif text-neutral-900 border-l-2 border-[#0052a3] pl-1.5 leading-snug">
                    Sede Territoriale Roma-Eur (Chiuso per ferie)
                  </div>
                </div>
              </aside>

              {/* CENTER 2/4: DISPLAY PANEL & PLAYABLE CHAMBERS */}
              <section className="col-span-1 lg:col-span-6 bg-white p-4 md:p-6 relative flex flex-col overflow-y-auto dot-matrix-bg">
                
                {/* Header Room switch tabs */}
                <div className="flex flex-wrap gap-1 mb-6 border-b-2 border-neutral-900 pb-2 z-10">
                  <button
                    onClick={() => handleSwitchRoom(1)}
                    className={`py-2 px-3 text-[10px] md:text-xs font-bold font-mono tracking-wider transition-all duration-150 flex items-center gap-1.5 border-2 border-black rounded-t shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer ${
                      gameState.activeRoomId === 1
                        ? "bg-[#0052a3] text-white border-black font-black -translate-y-0.5 shadow-[4px_4px_0px_rgba(20,20,20,1)]"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>STANZA 1: CARTE</span>
                    {gameState.room1.roomCleared && <span className="text-emerald-500">✔</span>}
                  </button>

                  <button
                    onClick={() => handleSwitchRoom(2)}
                    className={`py-2 px-3 text-[10px] md:text-xs font-bold font-mono tracking-wider transition-all duration-150 flex items-center gap-1.5 border-2 border-black rounded-t shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer ${
                      gameState.activeRoomId === 2
                        ? "bg-[#0052a3] text-white border-black font-black -translate-y-0.5 shadow-[4px_4px_0px_rgba(20,20,20,1)]"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {gameState.room1.roomCleared ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>STANZA 2: DIGITAL</span>
                    {gameState.room2.roomCleared && <span className="text-emerald-500">✔</span>}
                  </button>

                  <button
                    onClick={() => handleSwitchRoom(3)}
                    className={`py-2 px-3 text-[10px] md:text-xs font-bold font-mono tracking-wider transition-all duration-150 flex items-center gap-1.5 border-2 border-black rounded-t shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer ${
                      gameState.activeRoomId === 3
                        ? "bg-[#0052a3] text-white border-black font-black -translate-y-0.5 shadow-[4px_4px_0px_rgba(20,20,20,1)]"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {gameState.room2.roomCleared ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>STANZA 3: CAVO SERVER</span>
                    {gameState.room3.roomCleared && <span className="text-emerald-500">✔</span>}
                  </button>
                </div>

                {/* Main playable area containing current selected room puzzle */}
                <div className="flex-1 z-10">
                  {gameState.activeRoomId === 1 && (
                    <Room1Bureaucracy
                      gameState={gameState}
                      onUpdateState={handleUpdateState}
                      onApplyPenalty={handleApplyPenalty}
                    />
                  )}

                  {gameState.activeRoomId === 2 && (
                    <Room2Digital
                      gameState={gameState}
                      onUpdateState={handleUpdateState}
                      onApplyPenalty={handleApplyPenalty}
                    />
                  )}

                  {gameState.activeRoomId === 3 && (
                    <Room3Future
                      gameState={gameState}
                      onUpdateState={handleUpdateState}
                      onApplyPenalty={handleApplyPenalty}
                      onTriggerVictory={triggerVictory}
                    />
                  )}
                </div>
              </section>

              {/* ASIDE 1/4: RIGHT COLUMN (INVENTORY, HINTS, ASSISTANCE) */}
              <aside className="col-span-1 lg:col-span-3 border-t-4 lg:border-t-0 lg:border-l-4 border-[#141414] p-4 flex flex-col bg-[#D1D0CB] space-y-4">
                
                {/* Inventory Title */}
                <h2 className="text-xs font-bold uppercase border-b-2 border-black pb-1 mb-2 tracking-wide text-neutral-800 text-left">
                  Inventario Oggetti
                </h2>

                {/* 2x2 grid representing the retro items */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Slot 1: Key of schedario */}
                  <div className="aspect-square bg-white border-2 border-black p-1.5 flex flex-col items-center justify-between text-center shadow-inner rounded">
                    {gameState.room1.bureaucraticKeyCollected ? (
                      <>
                        <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center text-lg mt-1 font-bold border border-black">🔑</div>
                        <span className="text-[9px] font-bold uppercase text-amber-900">Chiave Schedario</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[8px] uppercase text-gray-400 font-mono mt-auto mb-auto">Slot Libero</span>
                      </>
                    )}
                  </div>

                  {/* Slot 2: Lucido overlay */}
                  <div className="aspect-square bg-white border-2 border-black p-1.5 flex flex-col items-center justify-between text-center shadow-inner rounded">
                    {gameState.room1.overlayCollected ? (
                      <>
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-lg mt-1 font-bold border border-black">🔬</div>
                        <span className="text-[9px] font-bold uppercase text-blue-900">Filtro Lucido CUD</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[8px] uppercase text-gray-400 font-mono mt-auto mb-auto">Slot Libero</span>
                      </>
                    )}
                  </div>

                  {/* Slot 3: Nokia Cell phone */}
                  <div className="aspect-square bg-white border-2 border-black p-1.5 flex flex-col items-center justify-between text-center shadow-inner rounded">
                    {gameState.room2.nokiaCollected ? (
                      <>
                        <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-lg mt-1 font-bold border border-black">📱</div>
                        <span className="text-[9px] font-bold uppercase text-emerald-900">Nokia 3310</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[8px] uppercase text-gray-400 font-mono mt-auto mb-auto">Slot Libero</span>
                      </>
                    )}
                  </div>

                  {/* Slot 4: Approved stamped document */}
                  <div className="aspect-square bg-white border-2 border-black p-1.5 flex flex-col items-center justify-between text-center shadow-inner rounded">
                    {gameState.room1.stampedDocument ? (
                      <>
                        <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center text-lg mt-1 font-bold border border-red-500 text-red-600 rotate-[-12deg]">📄APPROVED</div>
                        <span className="text-[9px] font-bold uppercase text-red-900">Domanda Firmata</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[8px] uppercase text-gray-400 font-mono mt-auto mb-auto">Slot Libero</span>
                      </>
                    )}
                  </div>

                </div>

                {/* Clue bubble / advice prompt from Umberto helper */}
                <div className="flex-1 flex flex-col justify-end">
                  <div className="bg-[#0052a3] p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-white text-left">
                    <div className="text-[10px] font-bold uppercase mb-1 italic text-yellow-300">
                      Indizio Corrente
                    </div>
                    <p className="text-[10.5px] leading-snug font-mono">
                      {gameState.activeRoomId === 1 && "La password del gabinetto si svela sommando le quote coefficienti di Mario, Laura e Beppe. Allinea il lucido sul CUD."}
                      {gameState.activeRoomId === 2 && "La cassaforte si sblocca unendo l'anno di fondazione INPS e la Legge Fornero. Accendi il Nokia del nonno per ricevere l'OTP."}
                      {gameState.activeRoomId === 3 && "Ruota la Pubblica a Destra, la Complementare in Basso e il Privato in Alto. Sblocca la solidarietà per completare l'unione."}
                    </p>
                  </div>

                  {/* Hint and reset controllers */}
                  <div className="mt-4 pt-4 border-t border-black/20 flex gap-2">
                    <button
                      onClick={handleRequestHint}
                      className="w-10 h-10 rounded-full bg-white border-2 border-black hover:bg-yellow-250 hover:bg-yellow-100 flex items-center justify-center font-bold text-lg cursor-pointer transition shadow-[2px_2px_0px_rgba(0,0,0,1)] active:scale-95 shrink-0"
                      title="Chiedi suggerimento saggio"
                    >
                      ?
                    </button>
                    
                    <button
                      onClick={() => {
                        if (confirm("Sei sicuro di voler resettare e ricominciare da capo la sessione?")) {
                          handleResetGame();
                        }
                      }}
                      className="bg-neutral-900 text-white font-mono text-[9px] font-black uppercase tracking-wider py-1 px-2.5 rounded hover:bg-neutral-800 transition shadow-[2px_2px_0px_rgba(0,0,0,1)] active:scale-95"
                    >
                      Azzeramento Dati
                    </button>
                  </div>
                </div>
              </aside>

            </main>

            {/* Active detailed hint overlay note if any */}
            <AnimatePresence>
              {activeHint && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-yellow-50 max-w-md w-full border-4 border-black p-6 rounded-lg shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] font-mono text-left relative"
                  >
                    <div className="text-xs text-amber-800 font-extrabold uppercase border-b-2 border-amber-800 pb-1 mb-3">
                      💡 UFFICIO ARCHIVI - NOTA INFORMATIVA DELL'ESPERTO UMBERTO:
                    </div>
                    <p className="text-xs md:text-sm text-neutral-800 leading-relaxed font-semibold">
                      "{activeHint}"
                    </p>
                    <div className="text-[10px] text-amber-700 mt-4 italic border-t pt-2 border-dashed border-neutral-300">
                      *Prendi nota sul taccuino e clicca Chiudi per procedere con l'esperimento.
                    </div>
                    
                    <button
                      onClick={() => setActiveHint(null)}
                      className="absolute top-2 right-2 border border-black bg-white hover:bg-neutral-100 text-xs font-bold leading-none px-2 py-1 rounded shadow-sm"
                    >
                      ✕
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Footer status markers and institutional serials */}
            <footer className="bg-white border-t-4 border-[#141414] p-3 flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 gap-3">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500 border border-black"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">Sistema Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full border border-black ${gameState.room1.roomCleared ? "bg-green-500" : "bg-red-500 animate-pulse"}`}></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                    {gameState.room1.roomCleared ? "Stanza 1 Completata" : "Uscita Bloccata"}
                  </span>
                </div>
              </div>
              <div className="font-mono text-[9px] md:text-[10px] opacity-75 tracking-tight text-neutral-800 text-center sm:text-right">
                LICENZA MINISTERIALE: 00-449-RE-INPS | PRIVATO & RISERVATO | FUGA_VERSO_LA_PENSIONE.BAT
              </div>
            </footer>
          </>
        )}

      </div>
    </div>
  );
}


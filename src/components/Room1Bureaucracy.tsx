import React, { useState } from "react";
import { GameState } from "../types";
import { playSound } from "../utils/audio";
import { FileCode2, Key, FolderOpen, ClipboardCopy, Stamp, ArrowRight, ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Room1Props {
  gameState: GameState;
  onUpdateState: (updated: Partial<GameState>) => void;
  onApplyPenalty: (message: string, penalty: number) => void;
}

export default function Room1Bureaucracy({ gameState, onUpdateState, onApplyPenalty }: Room1Props) {
  // Enigma 1: Contributi calculations
  const [valMario, setValMario] = useState("");
  const [valLaura, setValLaura] = useState("");
  const [valBeppe, setValBeppe] = useState("");
  const [valTotal, setValTotal] = useState("");
  const [cabinetMessage, setCabinetMessage] = useState("");

  // Enigma 2: Modelli Form
  const [selectedForm, setSelectedForm] = useState<"730" | "Unico" | "ISEE" | "RED" | "CUD" | null>(null);
  const [lucidoOverlay, setLucidoOverlay] = useState(false);

  // Door Lock code pad
  const [padCode, setPadCode] = useState("");
  const [padError, setPadError] = useState(false);
  const [padSuccess, setPadSuccess] = useState(false);

  // Stamping mechanics
  const [checkedFormStamping, setCheckedFormStamping] = useState<"approvato" | "respinto" | null>(null);
  const [stampedDocMsg, setStampedDocMsg] = useState("");

  const checkContributi = () => {
    // Mario (Operaio, 18 years * 1.5 = 27)
    // Laura (Artista, 12 years * 2.0 = 24)
    // Beppe (Agricoltore, 25 years * 1.2 = 30)
    // Total = 27 + 24 + 30 = 81
    const m = parseFloat(valMario);
    const l = parseFloat(valLaura);
    const b = parseFloat(valBeppe);
    const tot = parseInt(valTotal);

    if (m === 27 && l === 24 && b === 30 && tot === 81) {
      playSound("success");
      onUpdateState({
        room1: {
          ...gameState.room1,
          cabinetUnlocked: true,
          bureaucraticKeyCollected: true,
          overlayCollected: true,
        },
      });
      setCabinetMessage("✨ Clack! Lo schedario d'acciaio rugginoso si è sbloccato! All'interno hai recuperato un FOGLIO LUCIDO PERFORATO con dei cerchi rossi intagliati.");
    } else {
      playSound("failure");
      onApplyPenalty("Errore di calcolo contributivo: il ministero ha rifiutato i coefficienti!", 60);
      setCabinetMessage("❌ I calcoli non quadrano! Il ministero rigetta le cifre e emette un verbale di sanzione (-60 secondi).");
    }
  };

  const handleApplyOverlay = () => {
    playSound("click");
    if (!gameState.room1.overlayCollected) {
      alert("Devi prima trovare il Foglio Lucido risolvendo l'Enigma dei Contributi Silenti!");
      return;
    }
    setLucidoOverlay(!lucidoOverlay);
  };

  const handleKeyPress = (num: string) => {
    playSound("click");
    if (padCode.length < 4) {
      setPadCode(prev => prev + num);
    }
  };

  const clearPad = () => {
    playSound("click");
    setPadCode("");
    setPadError(false);
  };

  const checkDoorAccess = () => {
    if (padCode === "7492") {
      playSound("unlock");
      setPadSuccess(true);
      setPadError(false);
      onUpdateState({
        room1: {
          ...gameState.room1,
          cudCodeCorrect: true,
        },
      });
    } else {
      playSound("failure");
      setPadError(true);
      onApplyPenalty("Codice della serratura errato! Tentativo forzato fallito.", 90);
    }
  };

  const handleSelectStamp = (type: "rosso_approvato" | "blu_respinto") => {
    playSound("click");
    onUpdateState({
      room1: {
        ...gameState.room1,
        selectedStamp: type,
      },
    });
  };

  const stampDocument = () => {
    if (!gameState.room1.selectedStamp) {
      alert("Seleziona prima uno dei timbri disponibili sulla scrivania!");
      return;
    }
    playSound("stamp");
    const stampType = gameState.room1.selectedStamp === "rosso_approvato" ? "approvato" : "respinto";
    setCheckedFormStamping(stampType);
    setStampedDocMsg(`Hai impresso energicamente il Timbro ${stampType === "approvato" ? "ROSSO 'APPROVATO'" : "BLU 'RESPINTO'"} sul modulo di domanda pensionistica.`);
  };

  const submitDocumentToGate = () => {
    if (!checkedFormStamping) {
      playSound("failure");
      alert("Il foglio inserito nella feritoia è vuoto! Devi prima timbrare il modulo.");
      return;
    }

    if (checkedFormStamping === "respinto") {
      playSound("failure");
      onApplyPenalty("Hai spedito un modulo timbrato RESPINTO! Pratica archiviata per sempre d'ufficio.", 150);
      setStampedDocMsg("💀 Allarme! La feritoia pneumatica ha risucchiato il foglio respinto e il sistema ha applicato un ritardo di 150 secondi come punizione burocratica!");
      setCheckedFormStamping(null);
      return;
    }

    if (checkedFormStamping === "approvato") {
      if (!gameState.room1.cudCodeCorrect) {
        playSound("failure");
        alert("Il modulo è approvato, ma la tastiera digitale segna 'INSERIRE CODICE SPEDITO'. La serratura elettronica è ancora bloccata!");
        return;
      }

      // Final room clearance!
      playSound("success");
      onUpdateState({
        activeRoomId: 2,
        room1: {
          ...gameState.room1,
          stampedDocument: true,
          submittedDocument: "approvato",
          roomCleared: true,
        },
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-800">
      
      {/* Room header banner */}
      <div className="bg-amber-100 border-l-4 border-amber-600 p-4 rounded-r-xl shadow-sm text-left">
        <h2 className="text-xl font-bold font-sans flex items-center gap-2 text-amber-900">
          <span>Stanza 1: L'Inferno della Burocrazia Cartacea (Anni '80)</span>
        </h2>
        <p className="text-xs text-amber-800 mt-1">
          L'ufficio del funzionario Grigiastro è bloccato da una porta a comando pneumo-elettronico. Trova i contributi mancanti, decifra la sequenza dei vecchi moduli CUD e timbra la tua domanda con il colore idoneo per sbloccare la valvola di scarico.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Puzzle 1: Contributi sum */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-neutral-100 pb-2">
              <FolderOpen className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-700">1. Gli Schedari Silenti</h3>
            </div>

            {/* Educational poster description */}
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100 text-[11px] font-mono leading-relaxed mb-4">
              <span className="text-amber-700 font-bold block mb-1">📋 REGOLAMENTO COMPLEMENTARE INPS:</span>
              I "Contributi Equivalenti" si calcolano decuplicando gli anni e moltiplicando per il coefficiente di usura:
              <br />
              <strong className="text-neutral-800">• Operaio:</strong> coeff. <span className="underline">1.5</span>
              <br />
              <strong className="text-neutral-800">• Artista:</strong> coeff. <span className="underline">2.0</span>
              <br />
              <strong className="text-neutral-800">• Lavoratore Agricolo:</strong> coeff. <span className="underline">1.2</span>
              <br />
              Formula: <code className="bg-neutral-200 px-1 rounded font-bold">Anni lavorati × Coefficiente = Quota Parziale</code>
            </div>

            {/* Three dossiers */}
            <h4 className="text-xs font-bold text-neutral-600 mb-2 uppercase">Fascicoli Lavoratori Trovati:</h4>
            <div className="space-y-3 mb-4">
              <div className="p-2.5 bg-yellow-50/60 rounded border border-yellow-200/80 text-xs text-left">
                <strong>📁 Fascicolo #1: Mario</strong> (Operaio)
                <div className="text-neutral-500 mt-0.5">Anni dichiarati sul libretto: <span className="font-bold text-neutral-800">18 anni</span></div>
              </div>
              <div className="p-2.5 bg-purple-50/60 rounded border border-purple-200/80 text-xs text-left">
                <strong>📁 Fascicolo #2: Laura</strong> (Artista)
                <div className="text-neutral-500 mt-0.5">Anni dichiarati sul libretto: <span className="font-bold text-neutral-800">12 anni</span></div>
              </div>
              <div className="p-2.5 bg-green-50/60 rounded border border-green-200/80 text-xs text-left">
                <strong>📁 Fascicolo #3: Beppe</strong> (Agricoltore)
                <div className="text-neutral-500 mt-0.5">Anni dichiarati sul libretto: <span className="font-bold text-neutral-800">25 anni</span></div>
              </div>
            </div>

            {/* User inputs */}
            <div className="space-y-2 border-t pt-3 border-dashed border-neutral-100">
              <label className="text-[11px] font-bold text-neutral-500 block">INSERISCI LE QUOTE CALCOLATE:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="group relative">
                  <label className="text-[10px] text-neutral-500 block font-mono font-bold mb-1">Quota Mario</label>
                  <input
                    type="number"
                    value={valMario}
                    onChange={(e) => setValMario(e.target.value)}
                    disabled={gameState.room1.cabinetUnlocked}
                    className="w-full text-center border-2 border-black rounded-sm p-3.5 text-base md:text-lg bg-white font-mono font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-yellow-50 outline-none"
                    placeholder="18 x 1.5?"
                  />
                  {gameState.demoMode && (
                    <button
                      type="button"
                      onClick={() => setValMario("27")}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-300 text-black text-[9px] font-mono font-black py-0.5 px-2 rounded border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition cursor-pointer z-30 whitespace-nowrap"
                    >
                      💡 Auto: 27
                    </button>
                  )}
                </div>
                <div className="group relative">
                  <label className="text-[10px] text-neutral-500 block font-mono font-bold mb-1">Quota Laura</label>
                  <input
                    type="number"
                    value={valLaura}
                    onChange={(e) => setValLaura(e.target.value)}
                    disabled={gameState.room1.cabinetUnlocked}
                    className="w-full text-center border-2 border-black rounded-sm p-3.5 text-base md:text-lg bg-white font-mono font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-yellow-50 outline-none"
                    placeholder="12 x 2.0?"
                  />
                  {gameState.demoMode && (
                    <button
                      type="button"
                      onClick={() => setValLaura("24")}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-300 text-black text-[9px] font-mono font-black py-0.5 px-2 rounded border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition cursor-pointer z-30 whitespace-nowrap"
                    >
                      💡 Auto: 24
                    </button>
                  )}
                </div>
                <div className="group relative">
                  <label className="text-[10px] text-neutral-500 block font-mono font-bold mb-1">Quota Beppe</label>
                  <input
                    type="number"
                    value={valBeppe}
                    onChange={(e) => setValBeppe(e.target.value)}
                    disabled={gameState.room1.cabinetUnlocked}
                    className="w-full text-center border-2 border-black rounded-sm p-3.5 text-base md:text-lg bg-white font-mono font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-yellow-50 outline-none"
                    placeholder="25 x 1.2?"
                  />
                  {gameState.demoMode && (
                    <button
                      type="button"
                      onClick={() => setValBeppe("30")}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-300 text-black text-[9px] font-mono font-black py-0.5 px-2 rounded border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition cursor-pointer z-30 whitespace-nowrap"
                    >
                      💡 Auto: 30
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 group relative">
                <label className="text-[10.5px] font-bold text-neutral-850 block mb-1.5 font-mono">Somma Totale per Combinazione Schedario:</label>
                <input
                  type="number"
                  value={valTotal}
                  onChange={(e) => setValTotal(e.target.value)}
                  disabled={gameState.room1.cabinetUnlocked}
                  className="w-full text-center border-2 border-black rounded-sm p-4 font-black tracking-widest text-[#F27D26] bg-amber-50 font-mono text-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] outline-none"
                  placeholder="Somma i tre risultati..."
                />
                {gameState.demoMode && (
                  <button
                    type="button"
                    onClick={() => setValTotal("81")}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F27D26] hover:bg-[#ff8f3d] text-white text-[10px] font-mono font-black py-1 px-3 rounded border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition cursor-pointer z-30 whitespace-nowrap animate-bounce"
                  >
                    💡 Auto Somma: 81
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-100">
            {!gameState.room1.cabinetUnlocked ? (
              <button
                onClick={checkContributi}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm"
              >
                <Key className="w-4 h-4 text-amber-200" />
                <span>Sblocca Schedario Nazionale</span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-medium border border-emerald-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span>Schedario aperto! Ricevuto <strong>FOGLIO LUCIDO PERFORATO</strong>.</span>
                </div>
              </div>
            )}

            {cabinetMessage && (
              <p className="text-[10px] font-mono text-left mt-2 leading-relaxed text-amber-900 bg-amber-50/50 p-2 rounded">
                {cabinetMessage}
              </p>
            )}
          </div>
        </div>

        {/* Center column: Puzzle 2: Modelli overlays */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-neutral-100 pb-2">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-700">2. Il Labirinto dei Modelli</h3>
              </div>
              {gameState.room1.overlayCollected && (
                <button
                  onClick={handleApplyOverlay}
                  className={`py-1 px-3.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                    lucidoOverlay
                      ? "bg-amber-600 text-white"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  }`}
                >
                  {lucidoOverlay ? "Rimuovi Lucido" : "Sovrapponi Lucido"}
                </button>
              )}
            </div>

            <p className="text-xs text-neutral-500 mb-4 text-left">
              Fai clic su un modulo sparso sulla scrivania per ispezionarlo da vicino. Se possiedi il <strong className="text-neutral-800">Foglio Lucido Perforato</strong>, premi "Sovrapponi Lucido" per scoprire quali cifre segrete vi sono nascoste sotto.
            </p>

            {/* List of Models */}
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {(["730", "Unico", "ISEE", "RED", "CUD"] as const).map((form) => (
                <button
                  key={form}
                  onClick={() => { playSound("click"); setSelectedForm(form); }}
                  className={`py-2 px-1 rounded-xl text-center font-bold text-xs font-mono transition justify-between flex flex-col items-center h-16 border ${
                    selectedForm === form
                      ? "bg-amber-50 border-amber-600 text-amber-900 shadow-inner scale-95"
                      : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  <span className="text-[9px] uppercase text-neutral-400 block">Mod.</span>
                  <span className="text-sm font-black">{form}</span>
                </button>
              ))}
            </div>

            {/* Zoom screen for active form */}
            <div className="bg-amber-50/20 border-2 border-dashed border-amber-200 rounded-2xl p-4 h-52 relative flex items-center justify-center overflow-hidden">
              
              {!selectedForm ? (
                <div className="text-center p-4">
                  <span className="text-2xl block mb-2">📂</span>
                  <span className="text-xs text-neutral-400 font-mono">Dossier vuoto. Seleziona un modello fiscale sopra!</span>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col justify-between font-mono relative p-2 select-none">
                  {/* Top stamp mock */}
                  <div className="flex justify-between items-center text-[8px] text-neutral-400 border-b pb-1">
                    <span>MINISTERO DELLE FINANZE IPOTETICHE</span>
                    <span>ANNO DI IMPOSTA 1989</span>
                  </div>

                  {/* Body with numbers depending on form */}
                  <div className="grid grid-cols-4 gap-4 text-center my-auto relative">
                    {selectedForm === "730" && (
                      <>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">8</div>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">1</div>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">5</div>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">6</div>
                      </>
                    )}
                    {selectedForm === "Unico" && (
                      <>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">3</div>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">9</div>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">2</div>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">0</div>
                      </>
                    )}
                    {selectedForm === "ISEE" && (
                      <>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">6</div>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">5</div>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">1</div>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">4</div>
                      </>
                    )}
                    {selectedForm === "RED" && (
                      <>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">0</div>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">8</div>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">3</div>
                        <div className="p-1 rounded bg-white text-xs text-neutral-400">1</div>
                      </>
                    )}
                    {selectedForm === "CUD" && (
                      <>
                        <div className={`p-1.5 rounded text-xs font-bold transition duration-200 ${lucidoOverlay ? "bg-[#22c55e]/10 text-emerald-700 ring-2 ring-emerald-500 scale-110" : "bg-white text-neutral-400"}`}>
                          7
                        </div>
                        <div className={`p-1.5 rounded text-xs font-bold transition duration-200 ${lucidoOverlay ? "bg-[#22c55e]/10 text-emerald-700 ring-2 ring-emerald-500 scale-110" : "bg-white text-neutral-400"}`}>
                          4
                        </div>
                        <div className={`p-1.5 rounded text-xs font-bold transition duration-200 ${lucidoOverlay ? "bg-[#22c55e]/10 text-emerald-700 ring-2 ring-emerald-500 scale-110" : "bg-white text-neutral-400"}`}>
                          9
                        </div>
                        <div className={`p-1.5 rounded text-xs font-bold transition duration-200 ${lucidoOverlay ? "bg-[#22c55e]/10 text-emerald-700 ring-2 ring-emerald-500 scale-110" : "bg-white text-neutral-400"}`}>
                          2
                        </div>
                      </>
                    )}

                    {/* Laser Overlay simulator */}
                    {lucidoOverlay && (
                      <div className="absolute inset-0 bg-red-500/10 pointer-events-none rounded-lg border-2 border-red-500/40 flex items-center justify-center">
                        <div className="text-[10px] text-red-600 font-extrabold tracking-widest bg-white/95 py-1 px-3 border border-red-500 rounded shadow-md uppercase">
                          {selectedForm === "CUD" ? "FILTRO ALLINEATO (7 - 4 - 9 - 2!)" : "ERRORE ALLINEAMENTO FORI ❌"}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-[9px] text-neutral-400 text-center border-t pt-1 border-neutral-100">
                    NOME COMPILATORE: <span className="text-neutral-700 font-bold">FRANCESCO GRIGIASTRO</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t">
            <span className="text-[10px] text-neutral-400 font-mono block mb-1">PRODIGI DELLA BUROCRAZIA:</span>
            <div className="text-[11px] text-amber-800 bg-amber-50/50 p-2 rounded leading-relaxed text-left">
              Un vecchio appunto recita: <em>"Il codice della porta è il vecchio CUD dell'impiegato andato in ferie."</em>
            </div>
          </div>
        </div>

        {/* Right column: Door access and stamp action */}
        <div className="lg:col-span-3 bg-neutral-900 text-white rounded-2xl p-5 border-2 border-neutral-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-3 border-b border-neutral-800 pb-2">
              <Stamp className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-300">Timbri e Tastiera</h3>
            </div>

            {/* Interactive Keypad */}
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 mb-4 text-center group relative">
              <div className="font-mono text-xs text-neutral-300 mb-2 font-bold tracking-wider animate-pulse">TASTIERA DIGITALE PORTA</div>
              <div className="bg-black text-2xl md:text-3xl font-black p-3.5 rounded-sm text-red-500 h-14 tracking-widest font-mono border-2 border-neutral-850 flex items-center justify-center">
                {padCode || "----"}
              </div>
              {gameState.demoMode && (
                <button
                  type="button"
                  onClick={() => { playSound("click"); setPadCode("7492"); setPadError(false); }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-300 text-black text-[9px] font-mono font-black py-0.5 px-2.5 rounded border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition cursor-pointer z-50 whitespace-nowrap"
                >
                  💡 Auto Pin: 7492
                </button>
              )}

              <div className="grid grid-cols-3 gap-2 mt-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num.toString())}
                    className="p-3 bg-neutral-850 hover:bg-neutral-700 active:bg-neutral-600 text-white font-mono text-base font-black rounded cursor-pointer transition border border-neutral-800 shadow-[1px_1px_rgba(255,255,255,0.1)] hover:scale-[1.03]"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={clearPad}
                  className="p-3 bg-red-800 hover:bg-red-700 text-white font-mono font-black rounded cursor-pointer transition text-sm border border-red-950 shadow-[1px_1px_rgba(255,255,255,0.1)] hover:scale-[1.03]"
                >
                  C
                </button>
                <button
                  onClick={() => handleKeyPress("0")}
                  className="p-3 bg-neutral-850 hover:bg-neutral-700 active:bg-neutral-600 text-white font-mono text-base font-black rounded cursor-pointer transition border border-neutral-800 shadow-[1px_1px_rgba(255,255,255,0.1)] hover:scale-[1.03]"
                >
                  0
                </button>
                <button
                  onClick={checkDoorAccess}
                  className="p-3 bg-emerald-700 hover:bg-emerald-600 text-white font-mono font-black rounded cursor-pointer transition text-sm border border-emerald-800 shadow-[1px_1px_rgba(255,255,255,0.1)] hover:scale-[1.03]"
                >
                  INVIO
                </button>
              </div>

              {padError && (
                <div className="text-[10px] text-red-400 font-semibold mt-2 animate-pulse font-mono">
                  ❌ CODICE ERRATO (-90s!)
                </div>
              )}
              {gameState.room1.cudCodeCorrect && (
                <div className="text-[10px] text-emerald-400 font-semibold mt-2 font-mono">
                  ✅ CODICE REGISTRATO (7492)
                </div>
              )}
            </div>

            {/* Stamping Panel */}
            <div className="border-t border-neutral-800 pt-3">
              <span className="text-[10px] tracking-wider text-neutral-400 font-mono block mb-1">MODULO TRASFERIMENTO DIRETTO:</span>
              
              <div className="mb-3 flex justify-around gap-2">
                <button
                  onClick={() => handleSelectStamp("rosso_approvato")}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                    gameState.room1.selectedStamp === "rosso_approvato"
                      ? "bg-red-900/50 text-red-200 border-red-500"
                      : "bg-neutral-950 text-neutral-400 border-neutral-800"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  <span>Timbro Approva</span>
                </button>

                <button
                  onClick={() => handleSelectStamp("blu_respinto")}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                    gameState.room1.selectedStamp === "blu_respinto"
                      ? "bg-blue-900/50 text-blue-200 border-blue-500"
                      : "bg-neutral-950 text-neutral-400 border-neutral-800"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span>Timbro Respingi</span>
                </button>
              </div>

              <button
                onClick={stampDocument}
                className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-yellow-400 text-xs py-2.5 rounded-xl font-bold cursor-pointer transition flex items-center justify-center gap-1"
              >
                <Stamp className="w-3.5 h-3.5" />
                <span>Marca il Modulo!</span>
              </button>

              {/* Stamped feedback paper visual */}
              <div className="mt-3 bg-neutral-950 p-2.5 border border-neutral-800 rounded-lg text-left relative min-h-16">
                <div className="text-[8px] text-neutral-500 font-mono uppercase">STATO DOCUMENTO:</div>
                {checkedFormStamping ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-mono text-center mt-1"
                  >
                    <div className="text-[10px] text-white">Domanda di pensionamento e Quota fittizia</div>
                    <div className={`text-md font-black uppercase tracking-widest border-2 py-0.5 px-2 rounded inline-block mt-1 rotate-[-4deg] ${
                      checkedFormStamping === "approvato" ? "text-red-500 border-red-500" : "text-blue-500 border-blue-500"
                    }`}>
                      {checkedFormStamping === "approvato" ? "APPROVATO" : "RESPINTO ❌"}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-[10px] text-neutral-500 italic text-center py-2 font-mono">Modulo in attesa di timbro...</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800">
            <button
              onClick={submitDocumentToGate}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Infila nella Feritoia Pneumatica</span>
              <ArrowRight className="w-4 h-4 text-amber-200" />
            </button>
            {stampedDocMsg && (
              <p className="text-[9px] text-neutral-400 font-mono mt-2 leading-relaxed text-left">
                {stampedDocMsg}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from "react";
import { GameState } from "../types";
import { playSound } from "../utils/audio";
import { Laptop, Compass, ToggleLeft, HelpCircle, HardDrive, Smartphone, Check, Lock, Unlock, ShieldAlert, Newspaper } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Room2Props {
  gameState: GameState;
  onUpdateState: (updated: Partial<GameState>) => void;
  onApplyPenalty: (message: string, penalty: number) => void;
}

export default function Room2Digital({ gameState, onUpdateState, onApplyPenalty }: Room2Props) {
  // Safe / Combinazione
  const [safeInput, setSafeInput] = useState("");
  const [safeMessage, setSafeMessage] = useState("");
  const [showNokiaUI, setShowNokiaUI] = useState(false);

  // Modern PC / OTP Input
  const [otpInput, setOtpInput] = useState("");
  const [pcMessage, setPcMessage] = useState("");

  // Pensami simulation interactive values
  const [ageValue, setAgeValue] = useState(60);
  const [contributionValue, setContributionValue] = useState(35);
  const [simulationResult, setSimulationResult] = useState("");

  const handleOpenSafe = () => {
    // 1898 (founding) + 2011 (Fornero) concatenated is 18982011
    if (safeInput.trim() === "18982011") {
      playSound("unlock");
      onUpdateState({
        room2: {
          ...gameState.room2,
          safeUnlocked: true,
          nokiaCollected: true,
        },
      });
      setSafeMessage("🔓 CLICK! La pesante manopola della cassaforte gira con fragore. Al suo interno giace il leggendario NOKIA 3310 del nonno, ancora carico al 100%!");
    } else {
      playSound("failure");
      onApplyPenalty("Codice cassaforte errato! Il sensore anti-scasso ha bloccato il motore.", 75);
      setSafeMessage("❌ Combinazione errata! Un segnale acustico indica un blocco provvisorio dello sportello (-75 secondi).");
    }
  };

  const handleToggleNokia = () => {
    playSound("click");
    setShowNokiaUI(!showNokiaUI);
    if (!gameState.room2.nokiaOn) {
      playSound("success");
      onUpdateState({
        room2: {
          ...gameState.room2,
          nokiaOn: true,
        },
      });
    }
  };

  const handleVerifyOtp = () => {
    // SMS OTP is 512-884
    const sanitized = otpInput.replace("-", "").trim();
    if (sanitized === "512884") {
      playSound("success");
      onUpdateState({
        room2: {
          ...gameState.room2,
          spidOtpCorrect: true,
        },
      });
      setPcMessage("✅ Accesso SPID approvato! Il portale 'PENSAMI' si è sbloccato con successo ed è pronto per i calcoli di calcolo dell'aspettativa pensionistica.");
    } else {
      playSound("failure");
      onApplyPenalty("Codice OTP inserito errato! Tentativo di frode informatica rilevato.", 60);
      setPcMessage("❌ Codice non valido! Il firewall dell'INPS segnala un blocco IP temporaneo (-60 secondi). Rinvia l'OTP.");
    }
  };

  const calculatePensami = () => {
    playSound("click");
    // Standard rule in Italy (Quota 103): Age >= 62 and Contributions >= 41. Total Quota = Age + Contributions = 103
    // Alternatively: Old age retirement (Pensione di vecchiaia) is Age >= 67 and Contributions >= 20. Total = 87 with strict bounds.
    let success = false;
    let message = "";

    const totalQuota = ageValue + contributionValue;

    if (ageValue >= 62 && contributionValue >= 41 && totalQuota >= 103) {
      success = true;
      message = `🎉 PERFETTO! Hai sbloccato l'algoritmo di calcolo Pensionistico tramite Quote Flessibili (Quota ${totalQuota})! La tua richiesta viene inviata al server centrale.`;
    } else if (ageValue >= 67 && contributionValue >= 20) {
      success = true;
      message = `🎉 ECCELLENTE! Hai sbloccato l'algoritmo tramite Pensione di Vecchiaia (Età 67 e contributi minimi regolamentari). Portale centrale autorizzato!`;
    } else {
      // Calculate missing values for dynamic instructions
      if (ageValue < 62 && contributionValue >= 41) {
        message = `⚠️ RIFIUTATO: L'età anagrafica (${ageValue}) è inferiore al limite minimo di sbarramento legge (62 anni) per beneficiare di Quota 103.`;
      } else if (contributionValue < 41 && ageValue >= 62) {
        message = `⚠️ RIFIUTATO: La quota contributiva versata (${contributionValue}) non soddisfa il requisito minimo dei 41 anni per sbloccare la quota anticipata.`;
      } else {
        message = `⚠️ ERRORE: Età (${ageValue}) e contributi (${contributionValue}) non raggiungono i requisiti di Quota 103 (Età >= 62, Contributi >= 41) né della Vecchiaia Standard (Età >= 67 e Contributi >= 20).`;
      }
    }

    if (success) {
      playSound("success");
      onUpdateState({
        activeRoomId: 3,
        room2: {
          ...gameState.room2,
          magnets: { eta: ageValue, contributi: contributionValue },
          pensamiBalanced: true,
          roomCleared: true,
        },
      });
    } else {
      playSound("failure");
      onApplyPenalty("Inoltro di domanda di simulazione previdenziale irregolare!", 80);
    }
    setSimulationResult(message);
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-800">
      
      {/* Room header banner */}
      <div className="bg-amber-100 border-l-4 border-amber-600 p-4 rounded-r-xl shadow-sm text-left">
        <h2 className="text-xl font-bold font-sans flex items-center gap-2 text-amber-900">
          <span>Stanza 2: La Transizione Digitale (Il Presente)</span>
        </h2>
        <p className="text-xs text-amber-800 mt-1">
          Sei entrato nell'ufficio digitalizzato del terzo millennio! Per accedere al portale previdenziale "Pensami" ti serve lo SPID, il cui codice di sicurezza (OTP) è stato però recapitato sul vecchio telefonino cellulare di tuo nonno... che lo conserva gelosamente sotto chiave.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Historical archives and safe */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-neutral-100 pb-2">
              <Newspaper className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-700">1. Gli Archivi Storici</h3>
            </div>

            {/* Fictional Cuttings */}
            <h4 className="text-xs font-bold text-neutral-500 uppercase mb-2 font-mono">Ritagli di giornale d'epoca:</h4>
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-200 text-xs text-left">
                <span className="text-[10px] text-neutral-400 font-serif uppercase tracking-wider block">Gazzetta delle finanze (1898):</span>
                <p className="font-serif italic text-neutral-700 leading-normal mt-1">
                  "Con decreto reale, viene approvata la fondazione della Cassa Nazionale per l'assistenza agli operai di fabbrica. L'ente di previdenza diventerà l'INPS che conosciamo..."
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-200 text-xs text-left">
                <span className="text-[10px] text-neutral-400 font-serif uppercase tracking-wider block">Eco del Risparmio (2011):</span>
                <p className="font-serif italic text-neutral-700 leading-normal mt-1">
                  "Varata ieri sera d'urgenza la riforma pensionistica targata Fornero. Nuove severe soglie anagrafiche innalzano i requisiti minimi d'uscita a partire da questo drammatico anno..."
                </p>
              </div>
            </div>

            {/* Vintage Safe Input */}
            <div className="bg-neutral-900 text-white rounded-xl p-4 border border-neutral-800 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2 text-yellow-500">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">Cassa di Sicurezza Nonno</span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono mb-3">
                Inserisci l'anno di fondazione della prima cassa INPS e l'anno della Legge Fornero consecutivamente:
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
                <div className="group relative w-full sm:flex-1">
                  <input
                    type="text"
                    value={safeInput}
                    onChange={(e) => setSafeInput(e.target.value)}
                    disabled={gameState.room2.safeUnlocked}
                    className="w-full bg-black text-white p-3.5 rounded border-2 border-neutral-700 text-center font-mono font-black tracking-widest text-base md:text-lg focus:outline-none focus:border-yellow-500 shadow-inner"
                    placeholder="Es: AAAA + BBBB"
                  />
                  {gameState.demoMode && (
                    <button
                      type="button"
                      onClick={() => { playSound("click"); setSafeInput("18982011"); }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-300 text-black text-[9px] font-mono font-black py-0.5 px-2 rounded border border-black shadow-[1px_1px_rgba(0,0,0,1)] transition cursor-pointer z-50 whitespace-nowrap"
                    >
                      💡 Auto: 18982011
                    </button>
                  )}
                </div>
                {!gameState.room2.safeUnlocked && (
                  <button
                    onClick={handleOpenSafe}
                    className="w-full sm:w-auto bg-[#F27D26] hover:bg-[#ff8f3d] active:scale-95 text-xs text-white font-black font-sans py-3.5 px-6 rounded border-2 border-black tracking-wider transition cursor-pointer shrink-0 uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  >
                    GIRA MANOPOLA
                  </button>
                )}
              </div>

              {safeMessage && (
                <p className="text-[9px] font-mono text-left text-amber-400 mt-2 bg-neutral-950 p-2 border border-neutral-800 rounded">
                  {safeMessage}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t">
            {gameState.room2.safeUnlocked && (
              <button
                onClick={handleToggleNokia}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>{showNokiaUI ? "Nascondi Nokia 3310" : "Accendi Nokia 3310 del Nonno"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Center column: Phone Emulator or OTP Unlock */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-neutral-100 pb-2">
              <Smartphone className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-700">2. Dispositivo Mobile</h3>
            </div>

            <p className="text-xs text-neutral-500 mb-4 text-left">
              Utilizza lo schermo del telefono del Nonno per visualizzare l'SMS dell'Istituto Previdenziale necessario per validare la tua identità digitale.
            </p>

            {/* Vintage Nokia UI simulator */}
            <div className="flex justify-center my-2">
              <AnimatePresence>
                {showNokiaUI ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-48 bg-emerald-950 rounded-[40px] border-4 border-neutral-600 p-3 h-72 shadow-xl flex flex-col justify-between relative relative-phone-body"
                  >
                    {/* Retro Green monochrome Nokia LCD screen container */}
                    <div className="bg-[#a3b18a] hover:bg-[#b5c2a1] rounded p-2.5 h-32 border-2 border-neutral-800 font-mono text-neutral-900 select-none flex flex-col justify-between text-left">
                      <div className="flex justify-between items-center border-b border-neutral-800/20 pb-0.5 text-[8px]">
                        <span>📶 INPS_MOBILE</span>
                        <span>✉️ (1)</span>
                      </div>

                      <div className="text-[10px] leading-relaxed my-2">
                        <strong>INPS:</strong> Il tuo codice di accesso temporaneo (OTP) per accedere allo SPID è: <span className="underline font-bold bg-[#8d9975] py-0.5 px-1 rounded">512-884</span>. Scade tra 5 min.
                      </div>

                      <div className="text-[7px] text-center border-t border-neutral-800/10 pt-0.5">
                        Indietro | Opzioni
                      </div>
                    </div>

                    {/* Nostalgic plastic buttons grid */}
                    <div className="grid grid-cols-3 gap-1 grid-phone-keys mt-2 p-1">
                      <div className="h-4 bg-neutral-800 rounded-full flex items-center justify-center text-[7px] text-white">_</div>
                      <div className="h-5 bg-neutral-700 rounded-full flex items-center justify-center text-[7px] text-white">▲</div>
                      <div className="h-4 bg-neutral-800 rounded-full flex items-center justify-center text-[7px] text-white">_</div>

                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
                        <button
                          key={k}
                          onClick={() => playSound("click")}
                          className="h-5 bg-neutral-800 text-[8px] text-neutral-300 rounded font-black cursor-pointer active:bg-neutral-700"
                        >
                          {k}
                        </button>
                      ))}
                    </div>

                    <div className="absolute top-1 text-[7px] text-neutral-400 font-sans tracking-wide">NOKIA 3310</div>
                  </motion.div>
                ) : (
                  <div className="w-48 bg-neutral-100 rounded-[35px] border-4 border-dashed border-neutral-300 p-4 h-72 flex flex-col items-center justify-center text-center select-none text-neutral-400">
                    <span className="text-3xl">📱</span>
                    <span className="text-xs font-mono font-bold mt-2">Nokia Spento</span>
                    <p className="text-[9px] mt-2 font-mono leading-normal px-2">Trova la chiave della cassaforte del nonno per prelevare il telefono.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t">
            {/* OTP login validator on Laptop */}
            <div className="bg-neutral-100 p-3 rounded-xl border border-neutral-200">
              <span className="text-[9px] tracking-wider text-neutral-400 font-mono block mb-1">TERMINALE DI ACCESSO SPID:</span>
              <div className="flex flex-col sm:flex-row gap-2.5 mt-1.5">
                <div className="group relative w-full sm:flex-1">
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    disabled={gameState.room2.spidOtpCorrect}
                    className="w-full bg-white text-neutral-900 p-3.5 rounded border-2 border-black text-center font-mono font-black text-base md:text-lg tracking-widest placeholder:text-neutral-300 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    placeholder="OTP: XXX-XXX"
                  />
                  {gameState.demoMode && (
                    <button
                      type="button"
                      onClick={() => { playSound("click"); setOtpInput("512-884"); }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-300 text-black text-[9px] font-mono font-black py-0.5 px-2.5 rounded border border-black shadow-[1px_1px_rgba(0,0,0,1)] transition cursor-pointer z-50 whitespace-nowrap"
                    >
                      💡 Auto OTP: 512-884
                    </button>
                  )}
                </div>
                {!gameState.room2.spidOtpCorrect && (
                  <button
                    onClick={handleVerifyOtp}
                    className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-xs py-3.5 px-5 rounded border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
                  >
                    INVIO OTP
                  </button>
                )}
              </div>
              {pcMessage && (
                <p className="text-[9px] font-mono text-left leading-relaxed mt-2 text-neutral-600">
                  {pcMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Puzzle 2: Simulator Pensami */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border-2 border-neutral-200 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-3 border-b border-neutral-100 pb-2">
              <Laptop className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-700">3. Simulatore Pensami</h3>
            </div>

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 leading-normal mb-4 font-mono text-left">
              <strong>🧲 REGOLA QUOTA 103:</strong>
              Sposta i bilancieri di Età e Contributivi. La quota ideale richiede:
              <br />
              <span className="font-semibold text-amber-800">• Età minima:</span> 62 anni
              <br />
              <span className="font-semibold text-amber-800">• Contribuzione minima:</span> 41 anni
              <br />
              <span className="font-semibold text-amber-800">• Somma (Quota):</span> almeno 103!
              <br />
              <span className="text-[10px] text-neutral-500 italic block mt-1">(*Alternativa pensione vecchiaia: Età 67 e Contributi 20)</span>
            </div>

            {/* Interactive sliders representing Magnet Balance on board */}
            <div className="space-y-4 my-4">
              <div className="bg-neutral-50 p-3 rounded-xl border group relative animate-pulse-once">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-neutral-600">Età Lavoratore:</span>
                  <span className="font-mono font-black text-amber-600 bg-amber-55 px-2 rounded">{ageValue} anni</span>
                </div>
                <input
                  type="range"
                  min="55"
                  max="75"
                  value={ageValue}
                  onChange={(e) => { playSound("click"); setAgeValue(parseInt(e.target.value)); }}
                  disabled={!gameState.room2.spidOtpCorrect}
                  className="w-full accent-amber-600 cursor-pointer h-2 bg-neutral-200 rounded-lg appearance-none"
                />
                {gameState.demoMode && (
                  <button
                    type="button"
                    onClick={() => { playSound("click"); setAgeValue(62); }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-300 text-black text-[9px] font-mono font-black py-0.5 px-2 rounded border border-black shadow-[1px_1px_rgba(0,0,0,1)] transition cursor-pointer z-50 whitespace-nowrap"
                  >
                    💡 Auto Età: 62
                  </button>
                )}
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl border group relative">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-neutral-600">Contributi Versati:</span>
                  <span className="font-mono font-black text-amber-600 bg-amber-55 px-2 rounded">{contributionValue} anni</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="45"
                  value={contributionValue}
                  onChange={(e) => { playSound("click"); setContributionValue(parseInt(e.target.value)); }}
                  disabled={!gameState.room2.spidOtpCorrect}
                  className="w-full accent-amber-600 cursor-pointer h-2 bg-neutral-200 rounded-lg appearance-none"
                />
                {gameState.demoMode && (
                  <button
                    type="button"
                    onClick={() => { playSound("click"); setContributionValue(41); }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-300 text-black text-[9px] font-mono font-black py-0.5 px-2 rounded border border-black shadow-[1px_1px_rgba(0,0,0,1)] transition cursor-pointer z-50 whitespace-nowrap"
                  >
                    💡 Auto Contr.: 41
                  </button>
                )}
              </div>

              {/* Live Sum calculation box */}
              <div className="p-3 bg-neutral-900 text-white rounded-xl text-center border font-mono">
                <div className="text-[10px] text-neutral-400">CALCOLO DEL QUOZIENTE COMBINATO:</div>
                <div className="flex justify-center items-center gap-2 text-xl font-bold font-mono mt-1">
                  <span>{ageValue}</span>
                  <span className="text-amber-500">+</span>
                  <span>{contributionValue}</span>
                  <span className="text-amber-400">=</span>
                  <span className={`px-2.5 rounded font-black ${ageValue + contributionValue >= 103 && ageValue >= 62 && contributionValue >= 41 ? "bg-emerald-600 text-white" : "bg-neutral-800 text-yellow-500"}`}>
                    Quota {ageValue + contributionValue}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t">
            <button
              onClick={calculatePensami}
              disabled={!gameState.room2.spidOtpCorrect}
              className={`w-full font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition ${
                gameState.room2.spidOtpCorrect
                  ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md active:scale-95"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <span>Valida e Invia a Roma</span>
              <Check className="w-4 h-4 text-amber-200" />
            </button>
            {simulationResult && (
              <p className="text-[10px] font-mono text-left mt-2 leading-relaxed text-amber-900 bg-amber-50 p-2 border border-amber-200 rounded">
                {simulationResult}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

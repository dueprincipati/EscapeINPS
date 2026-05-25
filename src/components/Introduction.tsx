import React, { useState } from "react";
import { Coffee, Award, ShieldAlert, Timer, Users, FileText, ArrowRight } from "lucide-react";
import { playSound } from "../utils/audio";
import { motion } from "motion/react";

interface IntroductionProps {
  onStartGame: (difficulty: "standard" | "burocrate_esperto" | "quota_100_hero") => void;
}

export default function Introduction({ onStartGame }: IntroductionProps) {
  const [difficulty, setDifficulty] = useState<"standard" | "burocrate_esperto" | "quota_100_hero">("standard");
  const [ticketPrinted, setTicketPrinted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [estimatedWait, setEstimatedWait] = useState("");

  const printTicket = () => {
    playSound("stamp");
    const num = "K" + Math.floor(100 + Math.random() * 900);
    const years = Math.floor(45 + Math.random() * 120);
    setTicketNumber(num);
    setEstimatedWait(`${years} anni e 6 mesi`);
    setTicketPrinted(true);
  };

  const handeStart = () => {
    playSound("success");
    onStartGame(difficulty);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-neutral-900 select-none">
      {/* Title Header with retro logo */}
      <div className="text-center mb-8 bg-[#0052a3] text-white p-6 border-4 border-[#141414] shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-sm">
        <div className="inline-flex items-center justify-center p-3.5 bg-white text-[#0052a3] border-2 border-black rounded-full shadow-inner mb-3">
          <Coffee className="w-8 h-8 animate-bounce" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
          Fuga verso la Pensione
        </h1>
        <p className="text-xs font-mono font-bold tracking-widest text-[#F27D26] mt-1.5 uppercase italic">
          ★ Sotto-sistema di Orientamento al Pensionamento ★
        </p>
        <p className="text-xs max-w-xl mx-auto mt-3 text-neutral-200 leading-relaxed font-sans font-medium">
          Un'avventura ironica e burocratica all'interno dei misteriosi corridoi dell'INPS. Sblocca codici storici, calcola contributi artistici e raddrizza i laser previdenziali prima che scada il tempo!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Playable Lore card */}
        <div className="md:col-span-2 bg-white border-4 border-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-sm overflow-hidden flex flex-col justify-between">
          <div className="bg-[#141414] text-white p-3 font-mono text-[11px] flex justify-between items-center uppercase tracking-wider">
            <span>UFFICIO INPS - CERTIFICATO VIRTUAL v2.4</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          
          <div className="p-4 md:p-6 space-y-4 text-left">
            <h3 className="text-md font-bold uppercase border-b-2 border-[#141414] pb-1 flex items-center gap-2 text-[#0052a3]">
              <FileText className="w-5 h-5" />
              Il Rapporto Previdenziale
            </h3>
            <p className="text-neutral-800 text-xs md:text-sm leading-relaxed">
              Hai trascorso gli ultimi 40 anni a versare contributi con devozione. Oggi hai deciso di richiedere finalmente la pensione. Ma l'unica fotocopiatrice è rotta, il funzionario Grigiastro è andato in ferie in anticipo lasciandoti bloccato nel suo ufficio del 1980, lo SPID non vuole saperne di funzionare e l'algoritmo del sistema si è impallato.
            </p>
            <p className="text-neutral-800 text-xs md:text-sm leading-relaxed font-semibold">
              Hai esattamente <strong className="text-red-600 font-extrabold">60 minuti</strong> di tempo per attraversare tre epoche storiche della previdenza italiana, sbrogliare gli enigmi logici cartacei, digitali e futuri, e stampare il tuo legittimo cedolino prima di essere trattenuto d'ufficio per sempre!
            </p>

            <div className="border-t-2 border-[#141414] pt-4">
              <span className="text-[10px] text-neutral-500 font-mono font-bold uppercase block mb-2">PERCORSO DI SBLOCCO DEL SISTEMA:</span>
              <div className="grid grid-cols-3 gap-2.5 text-center text-[11px]">
                <div className="p-2 bg-neutral-100 border-2 border-black rounded-sm">
                  <div className="font-bold text-neutral-800">Fase 1</div>
                  <div className="text-neutral-500 font-mono text-[9px]">Cartacea '80</div>
                </div>
                <div className="p-2 bg-neutral-100 border-2 border-black rounded-sm">
                  <div className="font-bold text-neutral-800">Fase 2</div>
                  <div className="text-neutral-500 font-mono text-[9px]">Digitale SPID</div>
                </div>
                <div className="p-2 bg-neutral-100 border-2 border-black rounded-sm">
                  <div className="font-bold text-neutral-800">Fase 3</div>
                  <div className="text-neutral-500 font-mono text-[9px]">Caveau Future</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vintage Ticket Printer and Queue Card */}
        <div className="bg-[#D1D0CB] border-4 border-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] p-4 md:p-5 flex flex-col justify-between text-left rounded-sm relative overflow-hidden">
          <div>
            <h3 className="text-xs font-bold uppercase border-b-2 border-black pb-1 mb-3 flex items-center gap-2 text-neutral-800">
              <Users className="w-4 h-4 text-[#F27D26]" />
              Erogatore Ticket Fila
            </h3>
            <p className="text-[11px] text-neutral-700 leading-normal mb-4">
              Senza un ticket ufficiale della fila INPS, non potrai presentare alcun ricorso legale o giustificativo di fuga.
            </p>

            {!ticketPrinted ? (
              <button
                onClick={printTicket}
                className="w-full bg-[#F27D26] hover:bg-[#d46513] text-white py-3 px-4 font-mono font-bold text-xs border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-transform duration-100 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer rounded-sm"
                id="btn-print-ticket"
              >
                <span>Stampa Ticket della Fila</span>
              </button>
            ) : (
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white p-3 border-2 border-black font-mono text-center shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-sm"
              >
                <div className="text-[9px] text-neutral-400">INPS SEDE ROMA CENTRO</div>
                <div className="text-2xl font-black text-neutral-900 my-1 tracking-widest">{ticketNumber}</div>
                <div className="text-[10px] text-neutral-600 leading-tight">
                  Persone davanti a te: <strong className="text-red-650 font-bold">12.482</strong>
                  <br />
                  Tempo stimato attesa:
                  <br />
                  <strong className="text-red-600 font-bold block mt-1.5 text-xs bg-red-50 py-1 border border-red-200 rounded">{estimatedWait}</strong>
                </div>
                <div className="text-[8px] text-neutral-400 mt-2 border-t border-dashed border-neutral-200 pt-1.5 font-sans leading-none">
                  *Si consiglia di portare viveri e sacco a pelo.
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-6 border-t border-black/20 pt-3">
            <span className="text-[9px] text-neutral-500 font-mono font-bold uppercase block mb-1">Premio al Merito Previdenziale:</span>
            <div className="flex items-center gap-2 text-[11px] text-neutral-800">
              <Award className="w-4 h-4 text-[#F27D26] shrink-0" />
              <span>Attestato Pensionamento D'oro Legittimo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Setup & Launch */}
      <div className="bg-white border-4 border-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] p-5 text-left rounded-sm">
        <h3 className="text-xs font-black uppercase text-[#0052a3] pb-1 mb-4 border-b-2 border-black flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#F27D26]" />
          Seleziona il Livello di Rigore Burocratico
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => { playSound("click"); setDifficulty("standard"); }}
            className={`p-4 border-2 rounded-sm text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
              difficulty === "standard"
                ? "bg-amber-50 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                : "bg-neutral-50 border-gray-300 hover:border-black"
            }`}
          >
            <div className="font-bold text-xs text-neutral-900 flex items-center justify-between w-full">
              <span>Standard (Lavoratore Onesto)</span>
              {difficulty === "standard" && <span className="w-2.5 h-2.5 rounded-full bg-[#F27D26] border border-black"></span>}
            </div>
            <p className="text-[11px] text-neutral-600 leading-snug mt-1">
              Tempo generoso di 60 minuti. Suggerimenti spiritosi sempre a disposizione nelle bacheche.
            </p>
          </button>

          <button
            onClick={() => { playSound("click"); setDifficulty("burocrate_esperto"); }}
            className={`p-4 border-2 rounded-sm text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
              difficulty === "burocrate_esperto"
                ? "bg-amber-50 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                : "bg-neutral-50 border-gray-300 hover:border-black"
            }`}
          >
            <div className="font-bold text-xs text-neutral-900 flex items-center justify-between w-full">
              <span>Burocrate Esperto</span>
              {difficulty === "burocrate_esperto" && <span className="w-2.5 h-2.5 rounded-full bg-[#F27D26] border border-black"></span>}
            </div>
            <p className="text-[11px] text-neutral-600 leading-snug mt-1">
              Le anomalie applicano penalità di tempo raddoppiate se stampi respinti o coefficienti errati.
            </p>
          </button>

          <button
            onClick={() => { playSound("click"); setDifficulty("quota_100_hero"); }}
            className={`p-4 border-2 rounded-sm text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
              difficulty === "quota_100_hero"
                ? "bg-amber-50 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                : "bg-neutral-50 border-gray-300 hover:border-black"
            }`}
          >
            <div className="font-bold text-xs text-neutral-900 flex items-center justify-between w-full">
              <span>Eroe Quota 100</span>
              {difficulty === "quota_100_hero" && <span className="w-2.5 h-2.5 rounded-full bg-[#F27D26] border border-black"></span>}
            </div>
            <p className="text-[11px] text-neutral-600 leading-snug mt-1">
              Burocrazia spietata ed inflessibile. Il timer di fuga scorre il 25% più velocemente.
            </p>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-3 border-t border-black/10">
          <div className="flex items-center gap-2 text-xs text-amber-900 font-mono font-semibold">
            <Timer className="w-4 h-4 text-[#F27D26]" />
            <span>Tempo a disposizione: 60:00 minuti reali (con rettifica ritardi)</span>
          </div>

          <button
            onClick={handeStart}
            className="w-full sm:w-auto bg-[#0052a3] hover:bg-blue-800 text-white font-mono font-black py-3.5 px-8 border-2 border-black shadow-[4px_4px_0px_rgba(20,20,20,1)] transition-transform duration-100 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(20,20,20,1)] rounded-sm flex items-center justify-center gap-2 cursor-pointer text-xs uppercase"
            id="btn-start-escape"
          >
            <span>Avvia Fuga Previdenziale</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

export type RoomId = 1 | 2 | 3;

export interface WorkerContribution {
  id: string;
  name: string;
  category: "Operaio" | "Artista" | "Agricoltore";
  rawYears: number;
  coefficient: number; // For example Operaio: 1.5, Artista: 2.0, Agricoltore: 1.2
  calculatedContrab: number; // rawYears * coefficient
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: number;
  icon: string;
}

export interface GameState {
  isStarted: boolean;
  isCompleted: boolean;
  isGameOver: boolean;
  activeRoomId: RoomId;
  timeRemaining: number; // in seconds (starts at 3600 for 60 mins)
  totalTimeElapsed: number; // in seconds
  score: number;
  difficulty: "standard" | "burocrate_esperto" | "quota_100_hero";
  demoMode: boolean; // Demonstrative mode with hover solutions
  
  // Room 1 puzzles
  room1: {
    cabinetUnlocked: boolean; // Puzzle 1 solved
    bureaucraticKeyCollected: boolean;
    overlayCollected: boolean;
    overlayApplied: boolean;
    cudCodeAttempt: string;
    cudCodeCorrect: boolean; // Puzzle 2 solved
    selectedStamp: "rosso_approvato" | "blu_respinto" | null;
    stampedDocument: boolean;
    submittedDocument: "approvato" | "respinto" | null;
    shredderActivated: boolean;
    roomCleared: boolean;
  };

  // Room 2 puzzles
  room2: {
    safeUnlocked: boolean; // safe containing Nokia 3310
    nokiaCollected: boolean;
    nokiaOn: boolean;
    spidOtpAttempt: string;
    spidOtpCorrect: boolean; // Puzzle 1 solved
    magnets: {
      eta: number; // e.g., 67
      contributi: number; // e.g., 36
    };
    pensamiBalanced: boolean; // Puzzle 2 solved
    roomCleared: boolean;
  };

  // Room 3 puzzles
  room3: {
    prisms: {
      pubblica: number; // angle or placement selector: 0, 90, 180, 270
      complementare: number;
      privato: number;
    };
    laserAligned: boolean; // Puzzle 1 solved
    clickDayActive: boolean;
    clickDayTimeLeft: number; // countdown 120s
    buttonSolidarity1: boolean;
    buttonSolidarity2: boolean;
    finalPasswordAttempt: string;
    finalPasswordCorrect: boolean; // Puzzle 2 solved
    roomCleared: boolean;
  };

  penaltyLogs: Array<{
    id: string;
    text: string;
    timePenalty: number; // negative value
    timestamp: number;
  }>;
}

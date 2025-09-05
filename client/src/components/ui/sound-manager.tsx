import { createContext, useContext, useState, useEffect } from "react";

type SoundContextType = {
  soundEnabled: boolean;
  toggleSound: () => void;
  playHoverSound: () => void;
  playClickSound: () => void;
  playNotificationSound: () => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

interface SoundManagerProps {
  children: React.ReactNode;
}

export function SoundManager({ children }: SoundManagerProps) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sound-enabled") !== "false";
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("sound-enabled", soundEnabled.toString());
  }, [soundEnabled]);

  const playSound = (frequency: number, duration: number) => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log("Sound playback failed:", error);
    }
  };

  const playHoverSound = () => playSound(800, 0.1);
  const playClickSound = () => playSound(1000, 0.15);
  const playNotificationSound = () => playSound(600, 0.3);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
    if (!soundEnabled) {
      playClickSound();
    }
  };

  const value = {
    soundEnabled,
    toggleSound,
    playHoverSound,
    playClickSound,
    playNotificationSound,
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundManager");
  }
  return context;
};

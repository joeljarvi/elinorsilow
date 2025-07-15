"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

const AnimationContext = createContext<{
  isIdle: boolean;
  setIdleTimeout: (ms: number) => void;

  revealStep: number;
  advanceRevealStep: () => void;
  startRevealSequence: () => void;
}>({
  isIdle: false,
  setIdleTimeout: () => {},
  revealStep: 0,
  advanceRevealStep: () => {},
  startRevealSequence: () => {},
});

export const useAnimationContext = () => useContext(AnimationContext);

export const AnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [revealStep, setRevealStep] = useState(0);
  const revealTimers = useRef<NodeJS.Timeout[]>([]);
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeout = useRef(6000); // Default: 3 seconds

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsIdle(false);

    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, idleTimeout.current);
  };

  const advanceRevealStep = () => {
    setRevealStep((prev) => prev + 1);
  };
  const startRevealSequence = useCallback(() => {
    setRevealStep(0);
    revealTimers.current.forEach(clearTimeout);

    revealTimers.current = [
      setTimeout(() => setRevealStep(1), 200),
      setTimeout(() => setRevealStep(2), 700),
      setTimeout(() => setRevealStep(3), 1200),
      setTimeout(() => setRevealStep(4), 1700),
      setTimeout(() => setRevealStep(5), 2200),
      setTimeout(() => setRevealStep(6), 2700),
    ];
  }, []);

  useEffect(() => {
    const handleActivity = () => resetTimer();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("keydown", handleActivity);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      revealTimers.current.forEach(clearTimeout);
    };
  }, []);

  const setIdleTimeout = (ms: number) => {
    idleTimeout.current = ms;
    resetTimer();
  };

  return (
    <AnimationContext.Provider
      value={{
        isIdle,
        setIdleTimeout,
        revealStep,
        advanceRevealStep,
        startRevealSequence,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

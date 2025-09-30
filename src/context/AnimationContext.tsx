"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";

const AnimationContext = createContext<{
  revealStep: number;
  advanceRevealStep: () => void;
  startRevealSequence: () => void;
}>({
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

  return (
    <AnimationContext.Provider
      value={{
        revealStep,
        advanceRevealStep,
        startRevealSequence,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

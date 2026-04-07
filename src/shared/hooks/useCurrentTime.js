import { useEffect, useState } from "react";

const getDelayToNextTick = (intervalMs) => {
  const remainder = Date.now() % intervalMs;
  return remainder === 0 ? intervalMs : intervalMs - remainder;
};

export const useCurrentTime = (intervalMs = 1000) => {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    let intervalId;
    let timeoutId;

    setCurrentTime(new Date());

    timeoutId = window.setTimeout(() => {
      setCurrentTime(new Date());

      intervalId = window.setInterval(() => {
        setCurrentTime(new Date());
      }, intervalMs);
    }, getDelayToNextTick(intervalMs));

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [intervalMs]);

  return currentTime;
};

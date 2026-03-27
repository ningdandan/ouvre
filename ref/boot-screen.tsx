"use client";

import { useEffect, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { OuvreBackroomBackground } from "./ouvre-backroom-background";
import "./boot-screen.css";
import "./backroom.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

type Props = {
  id: string;
  onComplete: () => void;
  /** How long (ms) to show the text before starting the exit fade. Default 1800. */
  duration?: number;
};

/** Exit fade duration in ms — must match boot-exit-overlay animation in boot-screen.css */
const EXIT_MS = 600;

export function BootScreen({ id, onComplete, duration = 1800 }: Props) {
  const [exiting, setExiting] = useState(false);
  const line = `ouvre#${id} is unlocked`;

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), duration);
    return () => clearTimeout(exitTimer);
  }, [duration]);

  useEffect(() => {
    if (!exiting) return;
    const completeTimer = setTimeout(onComplete, EXIT_MS);
    return () => clearTimeout(completeTimer);
  }, [exiting, onComplete]);

  return (
    <div className={`boot-overlay ${spaceGrotesk.className}`}>
      <OuvreBackroomBackground />
      <div className="boot-dim" />
      <div className="boot-scanlines" />
      <div className="boot-text-wrap">
        <span className="techno-beat">
          <span className="boot-text-glitch techno-tremor" data-text={line}>
            {line}
            <span className="boot-cursor" />
          </span>
        </span>
      </div>
      {exiting && <div className="boot-exit-overlay" />}
    </div>
  );
}

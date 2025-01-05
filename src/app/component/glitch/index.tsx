"use client";

import React, { useEffect, useRef } from "react";
import styles from "./glitch.module.css";

type TextScrambleProps = {
  phrases: string[];
  className?: string;
  onlyOnce?: boolean; // New prop to control animation repetition
};

type QueueItem = {
  from: string;
  to: string;
  start: number;
  end: number;
  char?: string;
};

const useTextScramble = (
  elRef: React.RefObject<HTMLDivElement>,
  phrases: string[],
  onlyOnce: boolean = false // Default to false for continuous animation
) => {
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  const frameRef = useRef(0);
  const queueRef = useRef<QueueItem[]>([]);
  const resolveRef = useRef<() => void>(() => {});
  const frameRequestRef = useRef<number | null>(null);
  
  const counterRef = useRef(0); // To track the current phrase index

  const randomChar = () => chars[Math.floor(Math.random() * chars.length)];

  const update = () => {
    let output = "";
    let complete = 0;
    for (let i = 0, n = queueRef.current.length; i < n; i++) {
      let { from, to, start, end, char } = queueRef.current[i];
      if (frameRef.current >= end) {
        complete++;
        output += to;
      } else if (frameRef.current >= start) {
        if (!char || Math.random() < 0.28) {
          char = randomChar();
          queueRef.current[i].char = char;
        }
        output += `<span class="${styles.dud}">${char}</span>`;
      } else {
        output += from;
      }
    }
    if (elRef.current) elRef.current.innerHTML = output;
    if (complete === queueRef.current.length) {
      if (resolveRef.current) resolveRef.current();
    } else {
      frameRequestRef.current = requestAnimationFrame(update);
      frameRef.current++;
    }
  };

  const setText = (newText: string) => {
    const oldText = elRef.current ? elRef.current.innerText : "";
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => {
      resolveRef.current = resolve;
    });
    queueRef.current = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queueRef.current.push({ from, to, start, end });
    }
    cancelAnimationFrame(frameRequestRef.current ?? 0);
    frameRef.current = 0;
    update();
    return promise;
  };

  useEffect(() => {
    let isCancelled = false;
    const next = () => {
      if (isCancelled) return;

      if (counterRef.current < phrases.length) {
        setText(phrases[counterRef.current]).then(() => {
          counterRef.current += 1;
          if (!onlyOnce) {
            setTimeout(next, 2000); // Delay before next phrase
          }
        });
      } else if (!onlyOnce) {
        counterRef.current = 0; // Reset for looping
        setTimeout(next, 2000);
      }
      // If onlyOnce is true and all phrases are done, do not continue
    };
    next();
    return () => {
      isCancelled = true;
      cancelAnimationFrame(frameRequestRef.current ?? 0);
    };
  }, [phrases, onlyOnce]);

  return elRef;
};

const TextScramble: React.FC<TextScrambleProps> = ({ phrases, className, onlyOnce }) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  useTextScramble(elRef, phrases, onlyOnce);

  return <div className={`${styles.text} ${className}`} ref={elRef}></div>;
};

export default TextScramble;
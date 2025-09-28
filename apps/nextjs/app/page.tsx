"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  const confettiRef = useRef<((opts: any) => void) | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (count !== 100) return;

    async function loadConfetti() {
      if (typeof window === "undefined") return null;
      if ((window as any).confetti) return (window as any).confetti as any;
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("confetti load failed"));
        document.head.appendChild(script);
      });
      return (window as any).confetti as any;
    }

    loadConfetti().then((confetti) => {
      confettiRef.current = confetti;
      if (!confetti) return;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 80,
        zIndex: 0,
        colors: ["006ce9", "ac7ff4", "18b6f6", "713fc2", "ffffff"],
      };
      const duration = 15_000;
      const animationEnd = Date.now() + duration;
      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }
      const id = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          return;
        }
        const particleCount = 100 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.35), y: Math.random() - 0.1 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.65, 0.9), y: Math.random() - 0.1 },
        });
      }, 250);
      intervalRef.current = id;
    });
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [count]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{ fontSize: "10rem", padding: "100svh", cursor: "pointer" }}
      >
        {count}
      </button>
    </div>
  );
}

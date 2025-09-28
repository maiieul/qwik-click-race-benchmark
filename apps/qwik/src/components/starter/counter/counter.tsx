import { component$, $, useSignal, useTask$ } from "@qwik.dev/core";

export default component$(() => {
  const count = useSignal(0);

  const setCount = $(() => {
    count.value++;
  });

  const sendFireworks = $(async () => {
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 80,
      zIndex: 0,
      colors: ["006ce9", "ac7ff4", "18b6f6", "713fc2", "ffffff"],
    };

    function loadConfetti() {
      return new Promise<(opts: any) => void>((resolve, reject) => {
        if ((globalThis as any).confetti) {
          return resolve((globalThis as any).confetti as any);
        }
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
        script.onload = () => resolve((globalThis as any).confetti as any);
        script.onerror = reject;
        document.head.appendChild(script);
        script.remove();
      });
    }

    const confetti = await loadConfetti();

    const duration = 15 * 1000,
      animationEnd = Date.now() + duration;

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 100 * (timeLeft / duration);

      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.35), y: Math.random() - 0.1 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.65, 0.9), y: Math.random() - 0.1 },
        })
      );
    }, 250);
  });

  useTask$(({ track }) => {
    track(() => count.value);
    if (count.value === 100) {
      sendFireworks();
    }
  });

  return (
    <div>
      <button
        onClick$={setCount}
        style={{ fontSize: "10rem", padding: "100svh", cursor: "pointer" }}
      >
        {count.value}
      </button>
    </div>
  );
});

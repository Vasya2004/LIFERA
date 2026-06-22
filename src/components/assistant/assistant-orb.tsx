"use client";

import { useState, type CSSProperties, type PointerEvent } from "react";

type AssistantOrbProps = {
  onActivate?: () => void;
};

const PARTICLES = Array.from({ length: 12 }, (_, index) => ({
  delay: `${index * 0.18}s`,
  rotation: `${index * 30}deg`,
}));

export function AssistantOrb({ onActivate }: AssistantOrbProps) {
  const [style, setStyle] = useState<CSSProperties>({
    "--mx": "50%",
    "--my": "38%",
    "--tilt-x": "0deg",
    "--tilt-y": "0deg",
  } as CSSProperties);
  const [pulsing, setPulsing] = useState(false);

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const tiltY = ((x - 50) / 50) * 7;
    const tiltX = -((y - 50) / 50) * 7;

    setStyle({
      "--mx": `${Math.max(0, Math.min(100, x))}%`,
      "--my": `${Math.max(0, Math.min(100, y))}%`,
      "--tilt-x": `${tiltX.toFixed(2)}deg`,
      "--tilt-y": `${tiltY.toFixed(2)}deg`,
    } as CSSProperties);
  }

  function resetPointer() {
    setStyle({
      "--mx": "50%",
      "--my": "38%",
      "--tilt-x": "0deg",
      "--tilt-y": "0deg",
    } as CSSProperties);
  }

  function activate() {
    setPulsing(true);
    onActivate?.();
    window.setTimeout(() => setPulsing(false), 420);
  }

  return (
    <button
      aria-label="Сфокусировать ввод ассистента"
      className={["assistant-orb-shell", pulsing ? "is-pulsing" : ""].join(" ")}
      onClick={activate}
      onPointerLeave={resetPointer}
      onPointerMove={handlePointerMove}
      style={style}
      type="button"
    >
      <span className="assistant-orb-aura" />
      <span className="assistant-orb-beam" />
      <span className="assistant-orb-rings" aria-hidden="true">
        <span className="assistant-orb-ring assistant-orb-ring-one" />
        <span className="assistant-orb-ring assistant-orb-ring-two" />
        <span className="assistant-orb-ring assistant-orb-ring-three" />
      </span>
      <span className="assistant-orb-particles" aria-hidden="true">
        {PARTICLES.map((particle, index) => (
          <span
            className="assistant-orb-particle"
            key={index}
            style={{
              "--particle-delay": particle.delay,
              "--particle-rotation": particle.rotation,
            } as CSSProperties}
          />
        ))}
      </span>
      <span className="assistant-orb-core">
        <span className="assistant-orb-grain" />
        <span className="assistant-orb-liquid" />
        <span className="assistant-orb-highlight" />
      </span>
    </button>
  );
}

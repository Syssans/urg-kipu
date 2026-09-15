import { useEffect, useState } from "react";

export function Splash({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 700);
    const doneTimer = setTimeout(onDone, 1000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center bg-bg transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <svg viewBox="0 0 512 512" className="logo-in h-24 w-24">
        <path d="M190 150 L190 362" stroke="#a78bfa" strokeWidth={56} strokeLinecap="round" />
        <path d="M196 256 L348 150" stroke="#a78bfa" strokeWidth={56} strokeLinecap="round" />
        <path d="M196 256 L348 362" stroke="#a78bfa" strokeWidth={56} strokeLinecap="round" />
      </svg>
    </div>
  );
}

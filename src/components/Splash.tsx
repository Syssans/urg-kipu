import { useEffect, useState } from "react";
import { Logo } from "./Logo";

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
      <Logo className="logo-in h-24 w-24" />
    </div>
  );
}

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function TopBar() {
  const [timeLeft, setTimeLeft] = useState("--:--:--");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0);
      if (now > end) end.setDate(end.getDate() + 1);
      
      const d = end.getTime() - now.getTime();
      const h = Math.floor(d / 36e5);
      const m = Math.floor((d % 36e5) / 6e4);
      const s = Math.floor((d % 6e4) / 1e3);
      
      setTimeLeft(
        [h, m, s].map((v) => String(v).padStart(2, "0")).join(":")
      );
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-magenta text-white py-2.5 px-4 text-center text-xs md:text-sm font-medium print:hidden shadow-md relative z-50">
      <span className="opacity-90">Salon des Bâtisseurs 2026 —</span>{" "}
      <span className="font-bold">Jusqu'à -35% sur les parcours complets</span>{" "}
      <span className="opacity-90 inline-flex items-center gap-1.5 ml-2 bg-black/20 px-2.5 py-0.5 rounded-full">
        <Clock className="w-3.5 h-3.5" />
        Fin dans <b>{timeLeft}</b>
      </span>
    </div>
  );
}

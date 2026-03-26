import { useWizard } from "@/store/use-wizard";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { num: 1, label: "Contact" },
  { num: 2, label: "Modules" },
  { num: 3, label: "Devis" },
  { num: 4, label: "Envoi", isCheck: true }
];

export function StepsBar() {
  const { step, setStep } = useWizard();

  const isStepAccessible = (targetStep: number) => {
    if (targetStep <= step) return true;   // can always go back
    if (targetStep === step + 1) return true; // can go one step forward (form validates on its own)
    return false;
  };

  return (
    <div className="bg-white border-b border-border sticky top-0 z-40 print:hidden shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
        {STEPS.map((s, i) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          const accessible = isStepAccessible(s.num);

          return (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => accessible && setStep(s.num)}
                disabled={!accessible}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-2 group transition-all duration-300",
                  accessible ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                  isActive ? "bg-navy border-navy text-white shadow-md scale-110" :
                  isDone ? "bg-turq/10 border-turq text-turq" :
                  "bg-white border-border text-muted-foreground group-hover:border-navy/50"
                )}>
                  {isDone || s.isCheck ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : s.num}
                </div>
                <span className={cn(
                  "text-[10px] md:text-sm font-semibold uppercase tracking-wider transition-colors",
                  isActive ? "text-navy" : 
                  isDone ? "text-foreground" : 
                  "text-muted-foreground"
                )}>
                  {s.label}
                </span>
              </button>
              
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-2 md:mx-4 h-[2px] bg-border relative overflow-hidden rounded-full">
                  <div className={cn(
                    "absolute inset-0 bg-turq transition-all duration-500 origin-left",
                    isDone ? "scale-x-100" : "scale-x-0"
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useWizard } from "@/store/use-wizard";
import { TopBar } from "@/components/wizard/TopBar";
import { Hero } from "@/components/wizard/Hero";
import { StepsBar } from "@/components/wizard/StepsBar";
import { Step1Contact } from "@/components/wizard/Step1Contact";
import { Step2Modules } from "@/components/wizard/Step2Modules";
import { Step3Quote } from "@/components/wizard/Step3Quote";
import { Step4Confirmation } from "@/components/wizard/Step4Confirmation";
import { AnimatePresence } from "framer-motion";

export default function Wizard() {
  const { step } = useWizard();

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Hero />
      <StepsBar />
      
      <main className="flex-1 bg-background relative">
        <AnimatePresence mode="wait">
          {step === 1 && <Step1Contact key="step1" />}
          {step === 2 && <Step2Modules key="step2" />}
          {step === 3 && <Step3Quote key="step3" />}
          {step === 4 && <Step4Confirmation key="step4" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

import { useWizard } from "@/store/use-wizard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, Printer, RotateCcw } from "lucide-react";

export function Step4Confirmation() {
  const { reference, resetAll } = useWizard();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="max-w-md mx-auto py-16 px-4"
    >
      <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-turq/10 border-2 border-turq/20">
        <div className="w-24 h-24 bg-gradient-to-br from-turq to-teal rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-turq/30 text-white">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        
        <h2 className="text-3xl font-display text-navy mb-4">Pré-commande envoyée !</h2>
        
        <p className="text-muted-foreground mb-6 text-balance">
          Vous allez recevoir votre proposition commerciale détaillée et le catalogue P14 par email d'ici quelques minutes.
        </p>

        <div className="bg-slate-50 border border-border rounded-xl p-4 mb-8">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Votre référence</div>
          <div className="text-xl font-bold text-navy font-mono tracking-widest">{reference}</div>
        </div>

        <p className="text-sm font-medium text-navy mb-8">
          Notre équipe pédagogique vous contactera sous 24h pour finaliser votre inscription et votre dossier de financement.
        </p>

        <div className="space-y-3">
          <Button size="lg" className="w-full text-base" onClick={() => window.print()}>
            <Printer className="w-5 h-5 mr-2" /> Imprimer le récapitulatif
          </Button>
          <Button variant="secondary" size="lg" className="w-full" onClick={resetAll}>
            <RotateCcw className="w-4 h-4 mr-2" /> Nouvelle simulation
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

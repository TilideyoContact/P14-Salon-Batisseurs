import { useWizard, type SituationType } from "@/store/use-wizard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const SITUATIONS: { value: SituationType; label: string }[] = [
  { value: "dirigeant", label: "Dirigeant / Gérant" },
  { value: "rh", label: "Resp. Formation / RH" },
  { value: "salarie", label: "Salarié" },
  { value: "independant", label: "Indépendant" },
  { value: "autre", label: "Autre" }
];

export function Step1Contact() {
  const { contact, updateContact, setStep } = useWizard();

  const isValid = contact.prenom.trim().length >= 2 && contact.tel.trim().length >= 6;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto py-12 px-4"
    >
      <div className="text-center mb-8">
        <div className="text-5xl mb-4 animate-bounce-short">👋</div>
        <h2 className="text-2xl font-display text-navy mb-2">Bienvenue au configurateur P14</h2>
        <p className="text-muted-foreground text-balance">Composez votre formation en 2 minutes et repartez avec votre devis.</p>
      </div>

      <div className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 border border-border">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-navy mb-1.5">Votre prénom</label>
            <Input 
              placeholder="Ex: Jean-Marc" 
              value={contact.prenom}
              onChange={(e) => updateContact({ prenom: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-navy mb-1.5">Votre téléphone</label>
            <Input 
              type="tel"
              placeholder="0696 XX XX XX" 
              value={contact.tel}
              onChange={(e) => updateContact({ tel: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-bold text-navy mb-2">Votre situation</label>
            <div className="flex flex-wrap gap-2">
              {SITUATIONS.map((s) => (
                <label 
                  key={s.value} 
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium border-2 cursor-pointer transition-all duration-200
                    ${contact.situation === s.value 
                      ? "bg-navy border-navy text-white shadow-md" 
                      : "bg-background border-border text-foreground hover:border-navy/30"
                    }
                  `}
                >
                  <input 
                    type="radio" 
                    name="situation" 
                    className="sr-only"
                    checked={contact.situation === s.value}
                    onChange={() => updateContact({ situation: s.value })}
                  />
                  {s.label}
                </label>
              ))}
            </div>

            {/* Conditional Fields */}
            {contact.situation === 'dirigeant' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 p-4 bg-turq/5 border border-turq/20 rounded-xl flex items-center gap-3">
                <label className="text-sm font-semibold text-navy">Collaborateurs à former ?</label>
                <Input 
                  type="number" 
                  min="0" 
                  className="w-20 text-center !h-10" 
                  value={contact.nbSalaries}
                  onChange={(e) => updateContact({ nbSalaries: parseInt(e.target.value) || 0 })}
                />
                <span className="text-xs text-muted-foreground">(+ vous)</span>
              </motion.div>
            )}

            {contact.situation === 'rh' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 p-4 bg-violet/5 border border-violet/20 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <label className="text-sm font-semibold text-navy">Collaborateurs à inscrire ?</label>
                  <Input 
                    type="number" 
                    min="1" 
                    className="w-20 text-center !h-10 border-violet/30 focus-visible:ring-violet/20" 
                    value={contact.nbSalariesRH}
                    onChange={(e) => updateContact({ nbSalariesRH: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="text-xs text-violet font-medium flex items-center gap-1.5">
                  <span className="text-base">💡</span> Accompagnement dossier OPCO inclus.
                </div>
              </motion.div>
            )}

            {contact.situation === 'salarie' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 p-3 bg-violet/5 border border-violet/20 rounded-xl text-sm text-violet font-medium flex items-center gap-2">
                <span className="text-lg">💡</span> Financement OPCO possible. Nous vous accompagnons.
              </motion.div>
            )}

            {contact.situation === 'autre' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                <Input 
                  placeholder="Précisez (reconversion, étudiant...)"
                  value={contact.autreSituation}
                  onChange={(e) => updateContact({ autreSituation: e.target.value })}
                />
              </motion.div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <Button 
            size="lg" 
            className="w-full text-base group" 
            disabled={!isValid}
            onClick={() => setStep(2)}
          >
            Choisir mes modules 
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Aucun engagement. Données utilisées uniquement pour votre devis.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

import { useWizard, type CartItem } from "@/store/use-wizard";
import { PARCOURS } from "@/data/parcours";
import { computeTotals } from "@/lib/submit-order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useCompanySearch } from "@/hooks/use-company-search";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Building2, Check, Trash2 } from "lucide-react";

export function Step3Quote() {
  const { cart, quote, updateQuote, submitOrder, setStep, updateModuleQty, addFullTrack, isSubmitting, submitError } = useWizard();
  const [searchQuery, setSearchQuery] = useState(quote.entreprise || "");
  const [showResults, setShowResults] = useState(false);
  const { results, isLoading } = useCompanySearch(searchQuery);

  const cartItems = Object.values(cart);
  const { rawTotal, finalTotal, discounts } = computeTotals(cart);

  const handleCompanySelect = (company: any) => {
    const nom = company.nom_complet;
    const siret = company.siege.siret;
    const adresse = [company.siege.libelle_voie, company.siege.code_postal, company.siege.libelle_commune].filter(Boolean).join(' ');
    
    setSearchQuery(nom);
    updateQuote({ 
      entreprise: nom,
      entrepriseDetails: { nom, siret, adresse }
    });
    setShowResults(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    updateQuote({ entreprise: e.target.value, entrepriseDetails: null });
    setShowResults(true);
  };

  const isFormValid = cartItems.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      className="max-w-3xl mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-display text-navy mb-2">Votre devis estimatif</h2>
        <p className="text-muted-foreground">Vérifiez vos choix et renseignez vos coordonnées pour recevoir la proposition officielle.</p>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden mb-8">
        <div className="p-6 bg-slate-50 border-b border-border font-bold text-navy flex justify-between items-center">
          <span>Détail de la sélection</span>
          <span className="text-sm font-normal text-muted-foreground">{cartItems.length} ligne(s)</span>
        </div>
        <div className="divide-y divide-border">
          {cartItems.map((item) => {
            const track = PARCOURS[item.trackId];
            if (item.isFullTrack) {
              return (
                <div key={item.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase mb-1" style={{ backgroundColor: track.color }}>
                      Parcours Complet
                    </div>
                    <h4 className="font-bold text-navy text-lg">{track.label}</h4>
                    <p className="text-sm text-muted-foreground">{track.dur}</p>
                  </div>
                  <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                    <div className="flex items-center bg-slate-100 rounded-lg border border-border">
                      <button aria-label="Diminuer la quantité" className="w-8 h-8 flex items-center justify-center hover:bg-slate-200" onClick={() => addFullTrack(track.id, item.qty - 1)}>−</button>
                      <div className="w-8 text-center font-bold text-sm">{item.qty}</div>
                      <button aria-label="Augmenter la quantité" className="w-8 h-8 flex items-center justify-center hover:bg-slate-200" onClick={() => addFullTrack(track.id, item.qty + 1)}>+</button>
                    </div>
                    <div className="text-right w-24">
                      <div className="font-bold text-navy text-lg">{formatPrice(Math.round(track.price * 0.95) * item.qty)}</div>
                    </div>
                    <button onClick={() => addFullTrack(track.id, 0)} className="text-muted-foreground hover:text-destructive p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            } else {
              const mod = track.modules.find(m => m.id === item.id)!;
              return (
                <div key={item.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-turq mb-1">{track.label}</div>
                    <h4 className="font-bold text-navy">{mod.title}</h4>
                    <p className="text-sm text-muted-foreground">{mod.dur}</p>
                  </div>
                  <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                    <div className="flex items-center bg-slate-100 rounded-lg border border-border">
                      <button aria-label="Diminuer la quantité" className="w-8 h-8 flex items-center justify-center hover:bg-slate-200" onClick={() => updateModuleQty(track.id, mod.id, item.qty - 1)}>−</button>
                      <div className="w-8 text-center font-bold text-sm">{item.qty}</div>
                      <button aria-label="Augmenter la quantité" className="w-8 h-8 flex items-center justify-center hover:bg-slate-200" onClick={() => updateModuleQty(track.id, mod.id, item.qty + 1)}>+</button>
                    </div>
                    <div className="text-right w-24">
                      <div className="font-bold text-navy text-lg">{formatPrice(mod.price * item.qty)}</div>
                    </div>
                    <button onClick={() => updateModuleQty(track.id, mod.id, 0)} className="text-muted-foreground hover:text-destructive p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            }
          })}
          {cartItems.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Aucun module sélectionné.
              <br/>
              <Button variant="link" onClick={() => setStep(2)}>Retourner à la sélection</Button>
            </div>
          )}
        </div>

        {/* Totals */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-navy text-white">
            {discounts.length > 0 && (
              <div className="mb-4 pb-4 border-b border-white/20 space-y-2">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Total brut</span>
                  <span>{formatPrice(rawTotal)}</span>
                </div>
                {discounts.map((d, i) => (
                  <div key={i} className="flex justify-between text-sm text-magenta font-semibold">
                    <span>{d.label}</span>
                    <span>-{formatPrice(d.amount)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between items-end">
              <div>
                <div className="text-white/70 text-sm uppercase tracking-wider font-semibold mb-1">Total Estimé</div>
                <div className="text-xs text-turq font-medium">Prix définitif sur devis officiel</div>
              </div>
              <div className="text-right">
                {discounts.length > 0 && <div className="text-sm line-through text-white/50">{formatPrice(rawTotal)}</div>}
                <div className="text-4xl font-display text-white">{formatPrice(finalTotal)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-border shadow-lg shadow-black/5 relative z-10">
        <h3 className="font-bold text-navy text-lg mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-turq" />
          Informations complémentaires
        </h3>

        <div className="mb-5 relative">
          <label className="block text-sm font-bold text-navy mb-1.5">Entreprise / Agence</label>
          <div className="relative">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input 
              className="pl-11"
              placeholder="Nom de votre structure..." 
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showResults && searchQuery.length >= 3 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-turq rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-sm text-center text-muted-foreground">Recherche en cours...</div>
              ) : results.length > 0 ? (
                <ul className="py-1">
                  {results.map((r, i) => (
                    <li 
                      key={i} 
                      className="px-4 py-2 hover:bg-turq/5 cursor-pointer border-b border-border/50 last:border-0"
                      onClick={() => handleCompanySelect(r)}
                    >
                      <div className="font-bold text-sm text-navy">{r.nom_complet}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {[r.siege.libelle_voie, r.siege.code_postal, r.siege.libelle_commune].filter(Boolean).join(' ')} 
                        {r.siege.siret && ` · SIRET: ${r.siege.siret}`}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-sm text-muted-foreground text-center">Aucune entreprise trouvée. Saisie libre activée.</div>
              )}
            </div>
          )}

          {quote.entrepriseDetails && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-turq/10 rounded-lg border border-turq/20 text-sm">
              <div className="font-bold text-turq flex items-center gap-1"><Check className="w-4 h-4"/> {quote.entrepriseDetails.nom}</div>
              {quote.entrepriseDetails.adresse && <div className="text-navy mt-1">{quote.entrepriseDetails.adresse}</div>}
              {quote.entrepriseDetails.siret && <div className="text-muted-foreground text-xs mt-1">SIRET: {quote.entrepriseDetails.siret}</div>}
            </motion.div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-navy mb-1.5">Commentaire (optionnel)</label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Précisions, dates souhaitées, besoins OPCO..."
            rows={3}
            value={quote.comment}
            onChange={(e) => updateQuote({ comment: e.target.value })}
          />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-border">
          {submitError && (
            <div className="w-full text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {submitError}
            </div>
          )}
          <Button variant="secondary" onClick={() => setStep(2)} className="w-full sm:w-auto" disabled={isSubmitting}>← Modifier sélection</Button>
          <Button
            size="lg"
            className="w-full sm:flex-1 text-base"
            disabled={!isFormValid || isSubmitting}
            onClick={submitOrder}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Recevoir ma proposition →'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

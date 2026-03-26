import { useWizard } from "@/store/use-wizard";
import { PARCOURS } from "@/data/parcours";
import { computeTotals } from "@/lib/submit-order";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, Printer, RotateCcw, User, Building2, ShoppingCart } from "lucide-react";

const SITUATION_LABELS: Record<string, string> = {
  dirigeant: "Dirigeant / Gerant",
  rh: "Resp. Formation / RH",
  salarie: "Salarie",
  independant: "Independant",
  autre: "Autre",
};

export function Step4Confirmation() {
  const { reference, contact, cart, quote, resetAll } = useWizard();

  const cartItems = Object.values(cart);
  const { rawTotal, finalTotal, discounts } = computeTotals(cart);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto py-10 px-4"
    >
      {/* Print-only header */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-navy pb-4">
        <h1 className="text-2xl font-display text-navy">P14 Academy &mdash; Proposition commerciale</h1>
      </div>

      {/* Success card */}
      <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-turq/10 border-2 border-turq/20 print:shadow-none print:border print:border-border">
        <div className="w-24 h-24 bg-gradient-to-br from-turq to-teal rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-turq/30 text-white print:shadow-none">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h2 className="text-3xl font-display text-navy mb-4">Pre-commande envoyee !</h2>

        <p className="text-muted-foreground mb-6 text-balance">
          Vous allez recevoir votre proposition commerciale detaillee et le catalogue P14 par email d&apos;ici quelques minutes.
        </p>

        <div className="bg-slate-50 border border-border rounded-xl p-4 mb-8">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Votre reference</div>
          <div className="text-xl font-bold text-navy font-mono tracking-widest">{reference}</div>
        </div>

        <p className="text-sm font-medium text-navy mb-8 print:hidden">
          Notre equipe pedagogique vous contactera sous 24h pour finaliser votre inscription et votre dossier de financement.
        </p>
      </div>

      {/* ===== RECAP SECTION ===== */}
      <div className="bg-white rounded-3xl border border-border shadow-sm mt-8 overflow-hidden print:shadow-none print:mt-4">

        {/* Contact */}
        <div className="p-5 bg-slate-50 border-b border-border">
          <h3 className="font-bold text-navy flex items-center gap-2 text-sm uppercase tracking-wider">
            <User className="w-4 h-4 text-turq" /> Contact
          </h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Nom</span>
            <p className="font-semibold text-navy">{contact.prenom} {contact.nom}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Email</span>
            <p className="font-semibold text-navy">{contact.email}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Telephone</span>
            <p className="font-semibold text-navy">{contact.tel || "Non renseigne"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Situation</span>
            <p className="font-semibold text-navy">
              {contact.situation ? SITUATION_LABELS[contact.situation] ?? contact.situation : "Non renseignee"}
              {contact.situation === "autre" && contact.autreSituation ? ` (${contact.autreSituation})` : ""}
            </p>
          </div>
        </div>

        {/* Company (conditional) */}
        {(quote.entreprise || quote.entrepriseDetails) && (
          <>
            <div className="p-5 bg-slate-50 border-y border-border">
              <h3 className="font-bold text-navy flex items-center gap-2 text-sm uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-turq" /> Entreprise
              </h3>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Raison sociale</span>
                <p className="font-semibold text-navy">{quote.entrepriseDetails?.nom || quote.entreprise}</p>
              </div>
              {quote.entrepriseDetails?.siret && (
                <div>
                  <span className="text-muted-foreground">SIRET</span>
                  <p className="font-semibold text-navy font-mono">{quote.entrepriseDetails.siret}</p>
                </div>
              )}
              {quote.entrepriseDetails?.adresse && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground">Adresse</span>
                  <p className="font-semibold text-navy">{quote.entrepriseDetails.adresse}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Cart items */}
        {cartItems.length > 0 && (
          <>
            <div className="p-5 bg-slate-50 border-y border-border">
              <h3 className="font-bold text-navy flex items-center gap-2 text-sm uppercase tracking-wider">
                <ShoppingCart className="w-4 h-4 text-turq" /> Selection ({cartItems.length} ligne{cartItems.length > 1 ? "s" : ""})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {cartItems.map((item) => {
                const track = PARCOURS[item.trackId];
                if (item.isFullTrack) {
                  const linePrice = Math.round(track.price * 0.95) * item.qty;
                  return (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div
                          className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase mb-1"
                          style={{ backgroundColor: track.color }}
                        >
                          Parcours Complet
                        </div>
                        <h4 className="font-bold text-navy">{track.label}</h4>
                        <p className="text-xs text-muted-foreground">{track.dur}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground">x{item.qty}</div>
                        <div className="font-bold text-navy">{formatPrice(linePrice)}</div>
                      </div>
                    </div>
                  );
                } else {
                  const mod = track.modules.find((m) => m.id === item.id);
                  if (!mod) return null;
                  const linePrice = mod.price * item.qty;
                  return (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-turq mb-0.5">{track.label}</div>
                        <h4 className="font-bold text-navy text-sm">{mod.title}</h4>
                        <p className="text-xs text-muted-foreground">{mod.dur}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground">x{item.qty}</div>
                        <div className="font-bold text-navy">{formatPrice(linePrice)}</div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>

            {/* Totals */}
            <div className="p-5 bg-navy text-white print:bg-slate-800">
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
                  <div className="text-white/70 text-sm uppercase tracking-wider font-semibold mb-1">Total Estime</div>
                  <div className="text-xs text-turq font-medium">Prix definitif sur devis officiel</div>
                </div>
                <div className="text-right">
                  {discounts.length > 0 && (
                    <div className="text-sm line-through text-white/50">{formatPrice(rawTotal)}</div>
                  )}
                  <div className="text-3xl font-display text-white">{formatPrice(finalTotal)}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Comment */}
        {quote.comment && (
          <div className="p-5 border-t border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Commentaire</div>
            <p className="text-sm text-navy">{quote.comment}</p>
          </div>
        )}
      </div>

      {/* Buttons (hidden on print) */}
      <div className="mt-8 space-y-3 print:hidden">
        <Button size="lg" className="w-full text-base" onClick={() => window.print()}>
          <Printer className="w-5 h-5 mr-2" /> Imprimer le recapitulatif
        </Button>
        <Button variant="secondary" size="lg" className="w-full" onClick={resetAll}>
          <RotateCcw className="w-4 h-4 mr-2" /> Nouvelle simulation
        </Button>
      </div>
    </motion.div>
  );
}

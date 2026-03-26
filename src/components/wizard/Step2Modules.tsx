import { useState, useEffect, useRef } from "react";
import { useWizard } from "@/store/use-wizard";
import { PARCOURS, type Track, type Module } from "@/data/parcours";
import { Button } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckSquare, Square, ShoppingCart, Zap, BadgeEuro } from "lucide-react";

export function Step2Modules() {
  const { contact, setStep, cart } = useWizard();
  const [filter, setFilter] = useState<string>("all");
  const [openTrackId, setOpenTrackId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const tracks = filter === "all" ? Object.values(PARCOURS) : [PARCOURS[filter]];

  // Calculate cart summary
  const cartItems = Object.values(cart);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  let totalPrice = 0;
  cartItems.forEach(item => {
    if (item.isFullTrack) {
      const sp = Math.round(PARCOURS[item.trackId].price * 0.95);
      totalPrice += sp * item.qty;
    } else {
      const track = PARCOURS[item.trackId];
      const mod = track.modules.find(m => m.id === item.id);
      if (mod) totalPrice += mod.price * item.qty;
    }
  });

  const handleToggleTrack = (trackId: string) => {
    setOpenTrackId(prev => prev === trackId ? null : trackId);
  };

  // Scroll panel into view when it opens
  useEffect(() => {
    if (openTrackId && panelRef.current) {
      // Small delay to let the animation start before scrolling
      const timer = setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [openTrackId]);

  const openTrack = openTrackId ? PARCOURS[openTrackId] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto py-8 px-4 pb-40"
    >
      <div className="bg-gradient-to-r from-magenta/10 to-turq/10 border border-magenta/20 rounded-2xl p-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-magenta text-white rounded-full flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-navy">
              Jusqu'à <span className="text-magenta">-35%</span> sur les parcours complets — offre salon
            </p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-border" />
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-turq text-white rounded-full flex items-center justify-center shrink-0">
              <BadgeEuro className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-navy">
              Financement <span className="text-turq">CPF · OPCO · France Travail</span> — accompagnement inclus
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-display text-navy mb-2">
          {contact.prenom ? `${contact.prenom}, composez` : 'Composez'} votre formation
        </h2>
        <p className="text-muted-foreground">Ajoutez un parcours complet ou choisissez vos modules à la carte.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <TabButton active={filter === "all"} onClick={() => setFilter("all")}>Tous</TabButton>
        {Object.values(PARCOURS).map(t => {
          // count selected items for this track
          const count = cartItems.filter(i => i.trackId === t.id && i.qty > 0).length;
          return (
            <TabButton key={t.id} active={filter === t.id} onClick={() => setFilter(t.id)}>
              {t.label}
              {count > 0 && <span className="ml-2 bg-magenta text-white text-[10px] px-2 py-0.5 rounded-full">{count}</span>}
            </TabButton>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map(track => (
          <TrackCard
            key={track.id}
            track={track}
            isOpen={openTrackId === track.id}
            onToggle={() => handleToggleTrack(track.id)}
          />
        ))}
      </div>

      {/* Full-width Modules Panel below the grid */}
      <AnimatePresence mode="wait">
        {openTrack && (
          <motion.div
            key={openTrack.id}
            ref={panelRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-6"
          >
            <ModulesPanel track={openTrack} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 flex justify-start">
        <Button variant="secondary" onClick={() => setStep(1)}>← Retour au contact</Button>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 p-4 md:p-6 print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-turq/10 text-turq rounded-full flex items-center justify-center shrink-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-navy text-sm md:text-base">
                {totalItems === 0 ? "Panier vide" : `${totalItems} élément${totalItems > 1 ? 's' : ''} sélectionné${totalItems > 1 ? 's' : ''}`}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                {totalItems > 0 ? "Prêt pour l'estimation" : "Sélectionnez des modules pour continuer"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="text-right hidden xs:block">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total estimé</div>
              <div className="text-xl md:text-2xl font-bold text-navy leading-none">
                {formatPrice(totalPrice)}
              </div>
            </div>
            <Button
              size="lg"
              disabled={totalItems === 0}
              onClick={() => setStep(3)}
              className="px-4 md:px-8"
            >
              Voir mon devis →
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border-2",
        active
          ? "bg-navy border-navy text-white shadow-md"
          : "bg-white border-border text-foreground hover:border-navy/30"
      )}
    >
      {children}
    </button>
  );
}

function TrackCard({ track, isOpen, onToggle }: { track: Track, isOpen: boolean, onToggle: () => void }) {
  const { cart, addFullTrack } = useWizard();

  const fullId = `full_${track.id}`;
  const fullCartItem = cart[fullId];
  const isFullSelected = !!fullCartItem;
  const fullQty = fullCartItem?.qty || 0;

  const indModules = track.modules.filter(m => cart[m.id]?.qty > 0);
  const indCount = indModules.length;
  const isAlaCarte = indCount > 0 && !isFullSelected;

  const sp = Math.round(track.price * 0.95);
  const mt = track.modules.reduce((acc, m) => acc + m.price, 0);
  const pct = Math.round((1 - sp / mt) * 100);

  const indTotal = indModules.reduce((acc, m) => acc + (m.price * cart[m.id].qty), 0);

  const displayPrice = isFullSelected ? sp * fullQty : (isAlaCarte ? indTotal : sp);
  const displayOld = isFullSelected ? mt * fullQty : mt;

  return (
    <div className={cn(
      "bg-white rounded-3xl overflow-hidden border-2 transition-all duration-300 shadow-lg flex flex-col h-full",
      isFullSelected ? "border-magenta shadow-magenta/10" : "border-border hover:shadow-xl"
    )}>
      {/* Top Color Stripe */}
      <div className="h-3 w-full" style={{ backgroundColor: track.color }} />

      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <div
            className="inline-block px-3 py-1 rounded-lg text-white text-xs font-bold uppercase tracking-wider mb-3"
            style={{ backgroundColor: track.color }}
          >
            {track.label}
          </div>
          <div className="text-sm text-muted-foreground font-semibold">{track.dur}</div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{track.desc}</p>
        </div>

        {/* Pricing Area */}
        <div className="bg-slate-50 rounded-2xl p-5 mb-5 border border-border/50">
          {(isFullSelected || !isAlaCarte) ? (
            <>
              <div className="text-sm text-muted-foreground line-through font-medium mb-1">
                {formatPrice(displayOld)} séparés
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-display text-navy">{displayPrice.toLocaleString('fr')} €</span>
                <span className="text-sm font-bold text-navy">HT</span>
              </div>
              <div className="inline-block bg-magenta/10 text-magenta text-xs font-bold px-2.5 py-1 rounded-md">
                -{pct}% aujourd'hui
              </div>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-display text-navy">{indTotal.toLocaleString('fr')} €</span>
                <span className="text-sm font-bold text-navy">HT</span>
              </div>
              <div className="text-sm text-turq font-semibold">
                {indCount} module{indCount > 1 ? 's' : ''} à la carte
              </div>
            </>
          )}

          {/* Stepper for Full Track (only show if not a la carte) */}
          {!isAlaCarte && (
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-navy">Parcours complet</span>
              <div className="flex items-center bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <button
                  aria-label="Diminuer la quantité"
                  className="w-10 h-10 flex items-center justify-center text-lg hover:bg-slate-100 transition-colors"
                  onClick={() => addFullTrack(track.id, Math.max(0, fullQty - 1))}
                >−</button>
                <div className={cn("w-10 h-10 flex items-center justify-center font-bold text-lg", fullQty > 0 ? "bg-navy text-white" : "")}>
                  {fullQty}
                </div>
                <button
                  aria-label="Augmenter la quantité"
                  className="w-10 h-10 flex items-center justify-center text-lg hover:bg-slate-100 transition-colors"
                  onClick={() => addFullTrack(track.id, fullQty + 1)}
                >+</button>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center justify-between py-3 px-4 border rounded-xl font-semibold text-sm transition-colors mt-auto",
            isOpen
              ? "bg-slate-100 border-slate-300 text-navy"
              : "bg-white border-border hover:bg-slate-50"
          )}
        >
          <span className="flex items-center gap-2">
            {isAlaCarte ? <span className="text-turq">✏️ Modifier sélection</span> : "📋 Voir les modules"}
          </span>
          <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>
      </div>
    </div>
  );
}

function ModulesPanel({ track }: { track: Track }) {
  const { cart, toggleAllModules } = useWizard();

  const fullId = `full_${track.id}`;
  const isFullSelected = !!cart[fullId];

  return (
    <div className="bg-white rounded-2xl border-2 border-border shadow-lg overflow-hidden">
      {/* Colored top border */}
      <div className="h-2 w-full" style={{ backgroundColor: track.color }} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="inline-block px-3 py-1 rounded-lg text-white text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: track.color }}
            >
              {track.label}
            </div>
            <h3 className="text-lg font-bold text-navy">
              Modules du parcours ({track.modules.length})
            </h3>
          </div>

          {!isFullSelected && (
            <button
              onClick={() => toggleAllModules(track.id)}
              className="text-xs font-bold text-navy hover:text-turq uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              {track.modules.every(m => cart[m.id]?.qty > 0) ? (
                <><CheckSquare className="w-4 h-4"/> Tout décocher</>
              ) : (
                <><Square className="w-4 h-4"/> Tout cocher</>
              )}
            </button>
          )}
        </div>

        {/* Modules in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {track.modules.map((m) => (
            <ModuleItem key={m.id} trackId={track.id} module={m} disabled={isFullSelected} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ModuleItem({ trackId, module, disabled }: { trackId: string, module: Module, disabled: boolean }) {
  const { cart, updateModuleQty } = useWizard();
  const [expanded, setExpanded] = useState(false);

  const inCart = !!cart[module.id];
  const qty = inCart ? cart[module.id].qty : 0;

  const toggle = () => {
    if (disabled) return;
    updateModuleQty(trackId, module.id, inCart ? 0 : 1);
  };

  return (
    <div className={cn(
      "bg-white rounded-xl border p-3 transition-all duration-200",
      inCart ? "border-turq shadow-[0_0_0_1px_rgba(0,177,178,0.2)]" : "border-border",
      disabled ? "opacity-60 cursor-not-allowed grayscale" : ""
    )}>
      <div className="flex items-start gap-3 cursor-pointer" onClick={toggle}>
        <div className="pt-1 shrink-0">
          {inCart ? (
            <div className="w-5 h-5 rounded bg-turq text-white flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded border-2 border-muted-foreground/30 flex items-center justify-center" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h4 className="font-bold text-sm text-navy leading-tight">{module.title}</h4>
            <div className="font-bold text-sm text-navy whitespace-nowrap">{formatPrice(qty > 1 ? module.price * qty : module.price)}</div>
          </div>
          <div className="text-xs text-muted-foreground font-medium">{module.dur}</div>
        </div>
      </div>

      {inCart && !disabled && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between pl-8">
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="text-xs text-turq font-semibold hover:underline"
          >
            {expanded ? "Cacher détails" : "Voir programme"}
          </button>
          <div className="flex items-center bg-slate-50 border border-border rounded-lg overflow-hidden h-8">
            <button aria-label="Diminuer la quantité" className="w-8 flex items-center justify-center hover:bg-slate-200" onClick={(e) => { e.stopPropagation(); updateModuleQty(trackId, module.id, qty - 1); }}>−</button>
            <div className="w-8 flex items-center justify-center font-bold text-xs bg-white">{qty}</div>
            <button aria-label="Augmenter la quantité" className="w-8 flex items-center justify-center hover:bg-slate-200" onClick={(e) => { e.stopPropagation(); updateModuleQty(trackId, module.id, qty + 1); }}>+</button>
          </div>
        </div>
      )}

      {expanded && inCart && !disabled && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 pl-8 text-xs text-muted-foreground space-y-2">
          <div>
            <strong className="text-navy">Objectifs :</strong>
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              {module.obj.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          {module.tools.length > 0 && (
            <div>
              <strong className="text-navy">Outils :</strong> {module.tools.join(", ")}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

import { create } from 'zustand';
import { PARCOURS } from '@/data/parcours';

export type SituationType = 'dirigeant' | 'rh' | 'salarie' | 'independant' | 'autre' | null;

interface ContactInfo {
  prenom: string;
  tel: string;
  situation: SituationType;
  nbSalaries: number;
  nbSalariesRH: number;
  autreSituation: string;
}

export interface CartItem {
  id: string; // either 'full_trackId' or 'moduleId'
  qty: number;
  isFullTrack: boolean;
  trackId: string;
}

interface QuoteInfo {
  nom: string;
  email: string;
  entreprise: string;
  entrepriseDetails: { nom: string; siret: string; adresse: string } | null;
  comment: string;
}

interface WizardState {
  step: number;
  contact: ContactInfo;
  cart: Record<string, CartItem>;
  quote: QuoteInfo;
  reference: string | null;
  
  // Actions
  setStep: (step: number) => void;
  updateContact: (data: Partial<ContactInfo>) => void;
  
  // Cart Actions
  addFullTrack: (trackId: string, qty: number) => void;
  updateModuleQty: (trackId: string, moduleId: string, qty: number) => void;
  toggleAllModules: (trackId: string) => void;
  clearCart: () => void;
  
  // Quote Actions
  updateQuote: (data: Partial<QuoteInfo>) => void;
  submitOrder: () => void;
  resetAll: () => void;
}

const initialContact: ContactInfo = {
  prenom: '',
  tel: '',
  situation: null,
  nbSalaries: 0,
  nbSalariesRH: 1,
  autreSituation: '',
};

const initialQuote: QuoteInfo = {
  nom: '',
  email: '',
  entreprise: '',
  entrepriseDetails: null,
  comment: '',
};

export const useWizard = create<WizardState>((set, get) => ({
  step: 1,
  contact: initialContact,
  cart: {},
  quote: initialQuote,
  reference: null,

  setStep: (step) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    set({ step });
  },

  updateContact: (data) => set((state) => ({ contact: { ...state.contact, ...data } })),

  addFullTrack: (trackId, qty) => set((state) => {
    const newCart = { ...state.cart };
    const fullId = `full_${trackId}`;
    
    if (qty <= 0) {
      delete newCart[fullId];
    } else {
      newCart[fullId] = { id: fullId, qty, isFullTrack: true, trackId };
      // Clear individual modules for this track if buying full track
      PARCOURS[trackId].modules.forEach(m => {
        delete newCart[m.id];
      });
    }
    return { cart: newCart };
  }),

  updateModuleQty: (trackId, moduleId, qty) => set((state) => {
    const newCart = { ...state.cart };
    
    // If they were on a full track, clear it first
    const fullId = `full_${trackId}`;
    if (newCart[fullId]) {
      delete newCart[fullId];
    }

    if (qty <= 0) {
      delete newCart[moduleId];
    } else {
      newCart[moduleId] = { id: moduleId, qty, isFullTrack: false, trackId };
    }
    return { cart: newCart };
  }),

  toggleAllModules: (trackId) => set((state) => {
    const newCart = { ...state.cart };
    const track = PARCOURS[trackId];
    
    // Check if all are currently selected
    const allSelected = track.modules.every(m => newCart[m.id]?.qty > 0);
    
    // Remove full track if present
    delete newCart[`full_${trackId}`];

    if (allSelected) {
      // Uncheck all
      track.modules.forEach(m => { delete newCart[m.id]; });
    } else {
      // Check all
      track.modules.forEach(m => {
        newCart[m.id] = { id: m.id, qty: 1, isFullTrack: false, trackId };
      });
    }
    
    return { cart: newCart };
  }),

  clearCart: () => set({ cart: {} }),

  updateQuote: (data) => set((state) => ({ quote: { ...state.quote, ...data } })),

  submitOrder: () => {
    const ref = `SDB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    set({ reference: ref, step: 4 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  resetAll: () => set({
    step: 1,
    contact: initialContact,
    cart: {},
    quote: initialQuote,
    reference: null
  })
}));

import { PARCOURS } from '@/data/parcours';
import type { ContactInfo, QuoteInfo, CartItem } from '@/store/use-wizard';

interface SubmitParams {
  contact: ContactInfo;
  cart: Record<string, CartItem>;
  quote: QuoteInfo;
}

interface ResolvedCartItem {
  id: string;
  trackId: string;
  trackLabel: string;
  isFullTrack: boolean;
  label: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

function resolveCartItems(cart: Record<string, CartItem>): ResolvedCartItem[] {
  return Object.values(cart).map((item) => {
    const track = PARCOURS[item.trackId];

    if (item.isFullTrack) {
      const bundlePrice = Math.round(track.price * 0.95);
      return {
        id: item.id,
        trackId: item.trackId,
        trackLabel: track.label,
        isFullTrack: true,
        label: `Parcours Complet — ${track.label}`,
        unitPrice: bundlePrice,
        qty: item.qty,
        lineTotal: bundlePrice * item.qty,
      };
    }

    const mod = track.modules.find((m) => m.id === item.id);
    const price = mod?.price ?? 0;
    return {
      id: item.id,
      trackId: item.trackId,
      trackLabel: track.label,
      isFullTrack: false,
      label: mod ? `${mod.num} — ${mod.title}` : item.id,
      unitPrice: price,
      qty: item.qty,
      lineTotal: price * item.qty,
    };
  });
}

export function computeTotals(cart: Record<string, CartItem>) {
  let rawTotal = 0;
  let finalTotal = 0;
  const discounts: { label: string; amount: number }[] = [];

  const indItemsByTrack: Record<string, { qty: number; total: number }> = {};

  Object.values(cart).forEach((item) => {
    if (item.isFullTrack) {
      const track = PARCOURS[item.trackId];
      const mt = track.modules.reduce((s, m) => s + m.price, 0);
      const sp = Math.round(track.price * 0.95);
      const itemRaw = mt * item.qty;
      const itemFinal = sp * item.qty;

      rawTotal += itemRaw;
      finalTotal += itemFinal;

      if (itemRaw > itemFinal) {
        discounts.push({
          label: `Remise Parcours Complet (${track.label})`,
          amount: itemRaw - itemFinal,
        });
      }
    } else {
      const track = PARCOURS[item.trackId];
      const mod = track.modules.find((m) => m.id === item.id);
      if (mod) {
        const itemRaw = mod.price * item.qty;
        rawTotal += itemRaw;

        if (!indItemsByTrack[track.id]) indItemsByTrack[track.id] = { qty: 0, total: 0 };
        indItemsByTrack[track.id].qty += item.qty;
        indItemsByTrack[track.id].total += itemRaw;
      }
    }
  });

  Object.entries(indItemsByTrack).forEach(([trackId, data]) => {
    if (data.qty >= 3) {
      const discount = Math.round(data.total * 0.1);
      finalTotal += data.total - discount;
      discounts.push({
        label: `Remise Volume (3+ modules ${PARCOURS[trackId].label})`,
        amount: discount,
      });
    } else {
      finalTotal += data.total;
    }
  });

  return { rawTotal, finalTotal, discounts };
}

export async function submitOrderData(
  params: SubmitParams
): Promise<{ success: boolean; reference: string }> {
  const { contact, cart, quote } = params;
  const reference = `SDB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const resolvedItems = resolveCartItems(cart);
  const totals = computeTotals(cart);

  const payload = {
    reference,
    timestamp: new Date().toISOString(),
    contact: {
      prenom: contact.prenom,
      nom: contact.nom,
      email: contact.email,
      tel: contact.tel,
      situation: contact.situation,
      nbSalaries: contact.nbSalaries,
      nbSalariesRH: contact.nbSalariesRH,
      autreSituation: contact.autreSituation,
      rgpdConsent: contact.rgpdConsent,
    },
    items: resolvedItems,
    quote: {
      entreprise: quote.entreprise,
      entrepriseDetails: quote.entrepriseDetails,
      comment: quote.comment,
    },
    totals: {
      rawTotal: totals.rawTotal,
      finalTotal: totals.finalTotal,
      discounts: totals.discounts,
    },
  };

  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      '[submit-order] VITE_WEBHOOK_URL is not set. Logging payload to console instead.'
    );
    console.log('[submit-order] Payload:', JSON.stringify(payload, null, 2));
    return { success: true, reference };
  }

  // Google Apps Script redirects POST (302) which browsers convert to GET → 405.
  // Using mode: 'no-cors' avoids this. Content-Type must be 'text/plain' in no-cors mode.
  // The Apps Script doPost() still receives the JSON via e.postData.contents.
  await fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  });

  // With no-cors, response is opaque (can't read status), so we assume success.
  // If the network itself fails, fetch() will throw and the catch block in the store handles it.
  return { success: true, reference };
}

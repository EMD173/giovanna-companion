// Project CONJURE — Relational Language Protection
// Protects Black Language relational constructions from tokenization fragmentation
// before parent messages enter the OpenAI API.
//
// These constructions carry aspectual, temporal, and communal meaning
// that standard BPE tokenization would fragment into phonetic debris.
// Source: Davis (2026), Smitherman (1977), Rickford (1999)

export const CONJURE_PROTECTED_PAIRS: [string, string][] = [
  // Black American Language — aspectual and relational constructions
  ["finna go", "finna_go"],
  ["gon be", "gon_be"],
  ["ion know", "ion_know"],
  ["ain't even", "aint_even"],
  ["been done", "been_done"],
  ["come on now", "come_on_now"],
  ["for real", "for_real"],
  ["stay ready", "stay_ready"],
  ["I'm tryna", "im_tryna"],
  ["child please", "child_please"],
  ["been struggling", "been_struggling"],
  ["keep messing", "keep_messing"],
  ["stay in trouble", "stay_in_trouble"],
  ["finna act", "finna_act"],
  ["bout to", "bout_to"],
  ["fixing to", "fixing_to"],
  // Gullah/Geechee
  ["e bin", "e_bin"],
  ["fa true", "fa_true"],
  // Haitian Creole
  ["ap ale", "ap_ale"],
  ["te di", "te_di"],
];

/**
 * Protects relational language constructions before they enter the tokenizer.
 *
 * Replaces protected relational pairs with underscore-joined forms
 * so they survive as single semantic units through the tokenizer.
 * The model receives the protected form and responds coherently
 * because gpt-4o-mini understands joined forms in context.
 */
export function conjureProtect(message: string): string {
  let protected_message = message;
  for (const [original, joined] of CONJURE_PROTECTED_PAIRS) {
    const regex = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    protected_message = protected_message.replace(regex, joined);
  }
  return protected_message;
}

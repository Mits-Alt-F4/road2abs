/**
 * Robust price and macro calculation from product data.
 * Handles all Swiss supermarket package size formats without NaN.
 */

export interface PackageInfo {
  grams: number        // Total edible grams in package (or per unit for per-100g products)
  isPer100g: boolean   // True when price is listed per 100g
  isPerPiece: boolean  // True when sold by piece (eggs etc.)
  gramsPerPiece?: number
  pieces?: number
}

/**
 * Parse package size string into usable numbers.
 * Never throws. Returns null if unparseable.
 *
 * Examples:
 *   "400g"                   → { grams: 400 }
 *   "ca. 220g"               → { grams: 220 }
 *   "1000g" / "1kg"          → { grams: 1000 }
 *   "155g drained / 200g net"→ { grams: 155 }  (uses drained/edible weight)
 *   "10 Stück à 53g"         → { grams: 530, isPerPiece: true, pieces: 10, gramsPerPiece: 53 }
 *   "4×155g"                 → { grams: 620 }
 *   "326g (8 Stück)"         → { grams: 326 }
 *   "per 100g"               → { grams: 100, isPer100g: true }
 */
export function parsePackageInfo(priceUnit: string): PackageInfo | null {
  if (!priceUnit) return null
  const s = priceUnit.trim().toLowerCase()

  // Per-100g pricing (e.g. Optigal chicken)
  if (s.startsWith('per 100') || s === '100g' || s === 'per 100 g') {
    return { grams: 100, isPer100g: true, isPerPiece: false }
  }

  // "10 Stück à 53g" → total = 530g
  const stueckMatch = s.match(/(\d+)\s*st[üu]ck\s*[àa@]\s*([\d.]+)\s*g/)
  if (stueckMatch) {
    const pieces = parseInt(stueckMatch[1])
    const gramsEach = parseFloat(stueckMatch[2])
    return { grams: pieces * gramsEach, isPer100g: false, isPerPiece: true, pieces, gramsPerPiece: gramsEach }
  }

  // "10 Stück" without per-piece weight (eggs) — use standard 53g per egg
  const stueckOnlyMatch = s.match(/(\d+)\s*st[üu]ck/)
  if (stueckOnlyMatch) {
    const pieces = parseInt(stueckOnlyMatch[1])
    return { grams: pieces * 53, isPer100g: false, isPerPiece: true, pieces, gramsPerPiece: 53 }
  }

  // "4×155g" multipack
  const multipackMatch = s.match(/(\d+)\s*[x×*]\s*([\d.]+)\s*g/)
  if (multipackMatch) {
    const count = parseInt(multipackMatch[1])
    const each = parseFloat(multipackMatch[2])
    return { grams: count * each, isPer100g: false, isPerPiece: false }
  }

  // "155g drained / 200g net" — use the first (drained/edible) weight
  const drainedMatch = s.match(/([\d.]+)\s*g\s*drained/)
  if (drainedMatch) {
    return { grams: parseFloat(drainedMatch[1]), isPer100g: false, isPerPiece: false }
  }

  // "1kg", "1.5kg"
  const kgMatch = s.match(/([\d.]+)\s*kg/)
  if (kgMatch) {
    return { grams: parseFloat(kgMatch[1]) * 1000, isPer100g: false, isPerPiece: false }
  }

  // Plain grams — "ca. 220g", "400g", "326g (8 Stück)" etc.
  const gramMatch = s.match(/([\d.]+)\s*g/)
  if (gramMatch) {
    return { grams: parseFloat(gramMatch[1]), isPer100g: false, isPerPiece: false }
  }

  return null
}

/**
 * Calculate the cost of `quantityG` grams of a product.
 * Returns null if calculation cannot be done reliably.
 */
export function calcCost(
  priceChf: number,
  priceUnit: string,
  quantityG: number
): number | null {
  const info = parsePackageInfo(priceUnit)
  if (!info) return null
  if (!info.grams || info.grams <= 0) return null
  if (quantityG <= 0) return 0

  const costPerGram = priceChf / info.grams
  return costPerGram * quantityG
}

/**
 * Calculate the cost of `pieceCount` pieces of a count-based product.
 */
export function calcCostByPiece(
  priceChf: number,
  priceUnit: string,
  pieces: number
): number | null {
  const info = parsePackageInfo(priceUnit)
  if (!info || !info.isPerPiece || !info.pieces) return null
  const costPerPiece = priceChf / info.pieces
  return costPerPiece * pieces
}

/**
 * Calculate macros contributed by `quantityG` grams of a product.
 */
export function calcMacros(
  per100: { calories: number; protein: number; carbs: number; fat: number },
  quantityG: number
) {
  const ratio = quantityG / 100
  return {
    calories: Math.round(per100.calories * ratio),
    protein:  Math.round(per100.protein  * ratio * 10) / 10,
    carbs:    Math.round(per100.carbs    * ratio * 10) / 10,
    fat:      Math.round(per100.fat      * ratio * 10) / 10,
  }
}

/** Safe display: never shows NaN or Infinity */
export function fmtChf(value: number | null | undefined): string {
  if (value === null || value === undefined || !isFinite(value) || isNaN(value)) {
    return 'CHF –'
  }
  return `CHF ${value.toFixed(2)}`
}

/** Validate that a product's price data is usable */
export function productPriceValid(priceChf: number, priceUnit: string): boolean {
  if (!priceChf || isNaN(priceChf) || priceChf <= 0) return false
  const info = parsePackageInfo(priceUnit)
  return info !== null && info.grams > 0
}

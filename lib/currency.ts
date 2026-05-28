export const CURRENCY_CODE = "NPR";

/** Format a number as Nepalese Rupees (e.g. Rs. 3,250) */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: CURRENCY_CODE,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Shorter label for denomination chips (no decimals when whole number) */
export function formatDenomination(amount: number): string {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: CURRENCY_CODE,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
}

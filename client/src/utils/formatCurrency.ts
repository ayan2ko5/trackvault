
const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  SGD: "S$",
  AUD: "A$",
  CAD: "C$",
};


export const formatCurrency = (
  amount: number,
  currency: string = "INR"
): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0, 
  }).format(Math.round(amount));

  return `${symbol}${formatted}`;
};

export const formatCurrencyCompact = (
  amount: number,
  currency: string = "INR"
): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  if (amount >= 10000000) return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `${symbol}${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(1)}k`;

  return `${symbol}${Math.round(amount)}`;
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};
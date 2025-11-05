/**
 * Formats a number as currency with proper localization
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'INR')
 * @param locale - The locale for formatting (default: 'en-IN')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: "INR" | "USD" = "INR",
  locale: string = "en-IN"
): string {
  if (amount === null || amount === undefined) return "-";

  const formattedAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return formattedAmount;
}

/**
 * Formats amount in INR (Indian Rupees)
 * @param amount - The amount to format
 * @returns Formatted INR string
 */
export function formatINR(amount: number | null | undefined): string {
  return formatCurrency(amount, "INR", "en-IN");
}

/**
 * Formats amount in USD (US Dollars)
 * @param amount - The amount to format
 * @returns Formatted USD string
 */
export function formatUSD(amount: number | null | undefined): string {
  return formatCurrency(amount, "USD", "en-US");
}

/**
 * Converts USD to INR (you can adjust the exchange rate)
 * @param usdAmount - Amount in USD
 * @param exchangeRate - Current exchange rate (default: 83)
 * @returns Amount in INR
 */
export function convertUSDtoINR(
  usdAmount: number,
  exchangeRate: number = 83
): number {
  return usdAmount * exchangeRate;
}

/**
 * Converts INR to USD
 * @param inrAmount - Amount in INR
 * @param exchangeRate - Current exchange rate (default: 83)
 * @returns Amount in USD
 */
export function convertINRtoUSD(
  inrAmount: number,
  exchangeRate: number = 83
): number {
  return inrAmount / exchangeRate;
}

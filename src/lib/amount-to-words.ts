/**
 * Converts a number to Indian English words (e.g., 25000 → "Twenty-Five Thousand").
 * Handles values up to 99,99,99,999 (Indian numbering: ones, thousands, lakhs, crores).
 */

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function convertHundreds(n: number): string {
  let result = "";
  if (n >= 100) {
    result += `${ONES[Math.floor(n / 100)]!} Hundred `;
    n %= 100;
  }
  if (n >= 20) {
    result += `${TENS[Math.floor(n / 10)]!} `;
    n %= 10;
  }
  if (n > 0) {
    result += `${ONES[n]!} `;
  }
  return result;
}

function numberToWordsIndian(num: number): string {
  if (num === 0) return "Zero";

  let result = "";

  const crores = Math.floor(num / 10000000);
  num %= 10000000;

  const lakhs = Math.floor(num / 100000);
  num %= 100000;

  const thousands = Math.floor(num / 1000);
  num %= 1000;

  const hundreds = num;

  if (crores > 0) {
    result += `${convertHundreds(crores)}Crore `;
  }
  if (lakhs > 0) {
    result += `${convertHundreds(lakhs)}Lakh `;
  }
  if (thousands > 0) {
    result += `${convertHundreds(thousands)}Thousand `;
  }
  if (hundreds > 0) {
    result += convertHundreds(hundreds);
  }

  return result.trim();
}

/**
 * Converts an amount to Indian English words with "Rupees Only" suffix.
 * @param amount - The numeric amount
 * @returns String like "Twenty-Five Thousand Rupees Only"
 */
export function amountToWords(amount: number): string {
  if (amount < 0) {
    return `Negative ${numberToWordsIndian(Math.abs(amount))} Rupees Only`;
  }
  if (amount === 0) {
    return "Zero Rupees Only";
  }
  return `${numberToWordsIndian(amount)} Rupees Only`;
}

/**
 * Converts an amount to words without the "Rupees Only" suffix.
 */
export function amountToWordsShort(amount: number): string {
  if (amount < 0) {
    return `Minus ${numberToWordsIndian(Math.abs(amount))}`;
  }
  if (amount === 0) return "Zero";
  return numberToWordsIndian(amount);
}

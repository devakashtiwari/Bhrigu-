export const POOJA_TIME_SLOTS = [
  { time: "06:00 AM", label: "Brahma Muhurta / Dawn" },
  { time: "07:30 AM", label: "Pratah Kal" },
  { time: "09:00 AM", label: "Morning Sanctum" },
  { time: "11:00 AM", label: "Madhyahna" },
  { time: "04:30 PM", label: "Sayamkal" },
  { time: "06:30 PM", label: "Sandhya Aarti" },
  { time: "08:00 PM", label: "Shayana Aarti" },
] as const;

export const POOJA_CATEGORIES = [
  "All",
  "Abhishekam",
  "Archana",
  "Homam / Havan",
  "Japa / Anushthan",
  "Shanti / Dosha Nivaran",
  "Katha / Path",
  "Kalyanotsavam",
  "Special Darshan",
] as const;

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateBookingCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `BHR-2026-${num}${suffix}`;
}

export function generateTransactionId(method: string): string {
  const prefix = method === "UPI" ? "TXN-UPI" : method === "CARD" ? "TXN-CRD" : "TXN-NBK";
  const digits = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}-${digits}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

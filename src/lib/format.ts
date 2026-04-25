// Display formatters — no React, no API.
//
// why amounts come as strings: the backend serializes `decimal(12,2)` as a
// JSON string to preserve precision (avoids float rounding). We parse for
// display only, never for math; arithmetic that matters happens server-side.

export const formatCurrency = (amount: string | number): string => {
  const n = typeof amount === "string" ? parseFloat(amount) : amount
  if (!Number.isFinite(n)) return "Rs. 0.00"
  return `Rs. ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

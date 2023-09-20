let currencyOptions = { style: "currency", currency: "GHS" };
export function formatCurrency(value) {
  return value?.toLocaleString("en-GH", currencyOptions) || "";
}

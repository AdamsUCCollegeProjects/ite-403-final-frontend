const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatCurrency(amount: string): string {
  const value = Number.parseFloat(amount)

  if (Number.isNaN(value)) {
    return amount
  }

  return CURRENCY_FORMATTER.format(value)
}

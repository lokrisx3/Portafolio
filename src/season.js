const chileMonth = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Santiago', month: 'numeric' })

export function isFiestasPatrias(date = new Date()) {
  return chileMonth.format(date) === '9'
}

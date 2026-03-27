export const formatCurrency  = (n = 0)   => new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', maximumFractionDigits:0 }).format(n)
export const formatDate      = (d)        => new Date(d).toLocaleDateString('es-CO', { year:'numeric', month:'long',  day:'numeric' })
export const formatDateShort = (d)        => new Date(d).toLocaleDateString('es-CO')
export const formatMonthYear = (d)        => new Date(d).toLocaleDateString('es-CO', { month:'short', year:'2-digit' })
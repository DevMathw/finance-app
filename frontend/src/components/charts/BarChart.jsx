/**
 * BarChart.jsx — ingresos vs gastos últimos 6 meses.
 */
import { useEffect, useRef, useMemo } from 'react'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController } from 'chart.js'
import { formatCurrency } from '../../utils/formatCurrency'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController)

const groupByMonth = (transactions, n = 6) => {
  const now = new Date()
  const acc = {}
  for (let i = n - 1; i >= 0; i--) {
    const d   = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleDateString('es-CO', { month: 'short', year: '2-digit' })
    acc[key]  = { income: 0, expense: 0 }
  }
  transactions.forEach((t) => {
    const key = new Date(t.date).toLocaleDateString('es-CO', { month: 'short', year: '2-digit' })
    if (acc[key]) acc[key][t.type] += t.amount
  })
  return acc
}

export default function BarChart({ transactions = [] }) {
  const ref      = useRef(null)
  const chartRef = useRef(null)
  const grouped  = useMemo(() => groupByMonth(transactions), [transactions])

  useEffect(() => {
    if (!ref.current) return
    if (chartRef.current) chartRef.current.destroy()

    const labels   = Object.keys(grouped)
    const incomes  = labels.map((l) => grouped[l].income)
    const expenses = labels.map((l) => grouped[l].expense)

    chartRef.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Ingresos', data: incomes,  backgroundColor: 'rgba(163,230,53,0.7)',  borderRadius: 5, borderSkipped: false },
          { label: 'Gastos',   data: expenses, backgroundColor: 'rgba(248,113,113,0.55)', borderRadius: 5, borderSkipped: false },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top', align: 'end',
            labels: { padding: 16, usePointStyle: true, pointStyleWidth: 8, color: '#8585a0', font: { size: 11, family: 'Outfit' } },
          },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` },
            backgroundColor: '#13131f', titleColor: '#f4f4f8', bodyColor: '#8585a0',
            borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, padding: 12, cornerRadius: 8,
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#3d3d55', font: { size: 11 } }, border: { color: 'rgba(255,255,255,0.06)' } },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#3d3d55', font: { size: 11 }, callback: (v) => `$${(v/1000).toFixed(0)}k` },
            border: { dash: [4,4], color: 'transparent' },
          },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [grouped])

  return <canvas ref={ref} />
}
/**
 * DonutChart.jsx — gráfica de dona con Chart.js
 * Paleta coherente con el tema oscuro.
 */
import { useEffect, useRef } from 'react'
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js'
import { formatCurrency } from '../../utils/formatCurrency'

Chart.register(ArcElement, Tooltip, Legend, DoughnutController)

const PALETTE = ['#a3e635','#4ade80','#60a5fa','#f472b6','#fb923c','#a78bfa','#34d399','#fbbf24']

const LABELS = {
  alimentación:'🛒 Alimentación', transporte:'🚗 Transporte',
  vivienda:'🏠 Vivienda', salud:'💊 Salud',
  entretenimiento:'🎬 Entretenimiento', educación:'📚 Educación',
  ropa:'👕 Ropa', otros:'📦 Otros',
}

export default function DonutChart({ data = {} }) {
  const ref      = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    if (chartRef.current) chartRef.current.destroy()

    const keys   = Object.keys(data)
    const values = Object.values(data)

    chartRef.current = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        labels:   keys.map((k) => LABELS[k] || k),
        datasets: [{
          data:            values,
          backgroundColor: PALETTE.slice(0, keys.length),
          borderWidth:     0,
          hoverOffset:     10,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding:         16,
              usePointStyle:   true,
              pointStyleWidth: 8,
              color:           '#8585a0',
              font:            { size: 12, family: 'Outfit' },
            },
          },
          tooltip: {
            callbacks: { label: (ctx) => ` ${formatCurrency(ctx.raw)}` },
            backgroundColor: '#13131f',
            titleColor:      '#f4f4f8',
            bodyColor:       '#8585a0',
            borderColor:     'rgba(255,255,255,0.06)',
            borderWidth:     1,
            padding:         12,
            cornerRadius:    8,
          },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [data])

  if (!Object.keys(data).length) {
    return (
      <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-3)', fontSize:'0.85rem' }}>
        Sin datos de gastos aún
      </div>
    )
  }

  return <div style={{ maxWidth: 320, margin: '0 auto' }}><canvas ref={ref} /></div>
}
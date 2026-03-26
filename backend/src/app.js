/**
 * app.js
 * ─────────────────────────────────────────────────────────────
 * Configuración de Express.
 * Registra middlewares globales, rutas y manejo de errores.
 *
 * Orden importante:
 *   1. Middlewares globales (cors, json)
 *   2. Rutas
 *   3. 404 handler
 *   4. Error handler (siempre al final)
 */

const express            = require('express')
const cors               = require('cors')
const authRoutes         = require('./routes/authRoutes')
const transactionRoutes  = require('./routes/transactionRoutes')
const errorHandler       = require('./middlewares/errorHandler')

const app = express()

// ── Middlewares globales ──────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── Health check ──────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    status:  'ok',
    message: '💰 API de Finanzas Personales',
    version: '2.0.0',
  })
})

// ── Rutas ─────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes)
app.use('/api/transactions', transactionRoutes)

// ── 404 — ruta no encontrada ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error:   `Ruta ${req.method} ${req.path} no existe`,
  })
})

// ── Manejo global de errores (debe ser el último middleware) ───
app.use(errorHandler)

module.exports = app
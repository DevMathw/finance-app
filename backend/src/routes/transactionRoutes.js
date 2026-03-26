/**
 * transactionRoutes.js
 * Rutas privadas de transacciones.
 * Todas protegidas con JWT. POST incluye validaciones.
 *
 * IMPORTANTE: /summary debe estar ANTES de /:id para evitar
 * que Express interprete "summary" como un parámetro de ID.
 */

const express  = require('express')
const router   = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { requireFields, validateAmount } = require('../middlewares/validate')
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getSummary,
} = require('../controllers/transactionController')

// Aplica JWT a todas las rutas de este router
router.use(protect)

// GET  /api/transactions/summary  ← debe ir ANTES de /:id
router.get('/summary', getSummary)

// GET  /api/transactions
router.get('/', getTransactions)

// POST /api/transactions
router.post(
  '/',
  requireFields(['type', 'amount', 'description', 'category']),
  validateAmount,
  createTransaction
)

// DELETE /api/transactions/:id
router.delete('/:id', deleteTransaction)

module.exports = router
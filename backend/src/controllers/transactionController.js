// src/controllers/transactionController.js
// Maneja los 4 endpoints de transacciones.
// req.user viene del authMiddleware — contiene el usuario logueado.

const transactionService = require('../services/transactionService')

// ─────────────────────────────────────────────────────────────────
// GET /api/transactions
// Query params opcionales: ?type=expense&category=alimentación&sort=asc
// ─────────────────────────────────────────────────────────────────
const getTransactions = (req, res, next) => {
  try {
    const filters = {
      type:       req.query.type,
      category:   req.query.category,
      startDate:  req.query.startDate,
      endDate:    req.query.endDate,
      sort:       req.query.sort,
    }

    const transactions = transactionService.getTransactions(req.user.id, filters)

    return res.status(200).json({
      success: true,
      count:   transactions.length,
      data:    transactions,
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────
// POST /api/transactions
// Body: { type, amount, description, category, date?, notes? }
// ─────────────────────────────────────────────────────────────────
const createTransaction = (req, res, next) => {
  try {
    const transaction = transactionService.createTransaction(req.user.id, req.body)

    return res.status(201).json({
      success: true,
      message: 'Transacción creada correctamente',
      data:    transaction,
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────
// DELETE /api/transactions/:id
// ─────────────────────────────────────────────────────────────────
const deleteTransaction = (req, res, next) => {
  try {
    const deleted = transactionService.deleteTransaction(req.user.id, req.params.id)

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error:   'Transacción no encontrada',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Transacción eliminada correctamente',
      data:    deleted,
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────
// GET /api/transactions/summary
// Devuelve balance, totales y desglose por categoría
// ─────────────────────────────────────────────────────────────────
const getSummary = (req, res, next) => {
  try {
    const summary = transactionService.getSummary(req.user.id)

    return res.status(200).json({
      success: true,
      data:    summary,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getTransactions, createTransaction, deleteTransaction, getSummary }
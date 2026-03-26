// src/services/transactionService.js
// Lógica de negocio: cálculos de resumen y balance.
// Los controladores delegan aquí en lugar de hacer cálculos directamente.

const Transaction = require('../models/Transaction')

// Obtener transacciones con filtros
const getTransactions = (userId, filters) => {
  return Transaction.findByUser(userId, filters)
}

// Crear transacción con validaciones de negocio
const createTransaction = (userId, data) => {
  if (!data.type || !['income', 'expense'].includes(data.type)) {
    const err = new Error('El tipo debe ser "income" o "expense"')
    err.statusCode = 400
    throw err
  }
  if (!data.amount || isNaN(data.amount) || Number(data.amount) <= 0) {
    const err = new Error('El monto debe ser un número mayor a 0')
    err.statusCode = 400
    throw err
  }
  if (!data.description?.trim()) {
    const err = new Error('La descripción es obligatoria')
    err.statusCode = 400
    throw err
  }

  return Transaction.createTransaction(userId, data)
}

// Calcular resumen financiero del usuario
const getSummary = (userId) => {
  const all = Transaction.findByUser(userId)

  const totalIncome  = all.filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = all.filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const byCategory = all
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  return {
    totalIncome:  Number(totalIncome.toFixed(2)),
    totalExpense: Number(totalExpense.toFixed(2)),
    balance:      Number((totalIncome - totalExpense).toFixed(2)),
    byCategory,
    count:        all.length,
  }
}

// Eliminar transacción
const deleteTransaction = (userId, transactionId) => {
  return Transaction.deleteById(userId, transactionId)
}

module.exports = { getTransactions, createTransaction, getSummary, deleteTransaction }

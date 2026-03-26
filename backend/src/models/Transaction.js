// src/models/Transaction.js
// Funciones para manejar transacciones en el archivo JSON.

const { v4: uuid }        = require('uuid')
const { readDB, writeDB } = require('../config/db')

const VALID_CATEGORIES = [
  'alimentación', 'transporte', 'vivienda', 'salud',
  'entretenimiento', 'educación', 'ropa', 'otros',
]

// Obtener transacciones de un usuario con filtros opcionales
const findByUser = (userId, filters = {}) => {
  const db = readDB()
  let results = db.transactions.filter((t) => t.userId === userId)

  if (filters.type)      results = results.filter((t) => t.type === filters.type)
  if (filters.category)  results = results.filter((t) => t.category === filters.category)
  if (filters.startDate) results = results.filter((t) => new Date(t.date) >= new Date(filters.startDate))
  if (filters.endDate)   results = results.filter((t) => new Date(t.date) <= new Date(filters.endDate))

  // Ordenar por fecha (más reciente primero por defecto)
  results.sort((a, b) =>
    filters.sort === 'asc'
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date)
  )

  return results
}

// Crear una transacción
const createTransaction = (userId, data) => {
  // Validar categoría
  if (!VALID_CATEGORIES.includes(data.category?.toLowerCase())) {
    const err = new Error(`Categoría inválida. Opciones: ${VALID_CATEGORIES.join(', ')}`)
    err.statusCode = 400
    throw err
  }

  const db = readDB()

  const newTransaction = {
    id:          uuid(),
    userId,
    type:        data.type,        // 'income' | 'expense'
    amount:      Number(data.amount),
    description: data.description.trim(),
    category:    data.category.toLowerCase(),
    date:        data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    notes:       data.notes?.trim() || '',
    createdAt:   new Date().toISOString(),
  }

  db.transactions.push(newTransaction)
  writeDB(db)

  return newTransaction
}

// Eliminar una transacción (solo si pertenece al usuario)
const deleteById = (userId, transactionId) => {
  const db = readDB()
  const index = db.transactions.findIndex(
    (t) => t.id === transactionId && t.userId === userId
  )

  if (index === -1) return null

  const deleted = db.transactions[index]
  db.transactions.splice(index, 1)
  writeDB(db)

  return deleted
}

module.exports = { findByUser, createTransaction, deleteById, VALID_CATEGORIES }

// src/api/expenseApi.js
// Funciones que se comunican con los endpoints del backend.
// Los componentes llaman estas funciones, nunca hacen fetch directamente.

import axiosClient from './axiosClient'

// Obtener todos los gastos (con filtro opcional)
export const getExpenses = async (category = '') => {
  const params = category ? { category } : {}
  const response = await axiosClient.get('/expenses', { params })
  return response.data // { success, count, total, byCategory, data }
}

// Crear un nuevo gasto
export const createExpense = async (expenseData) => {
  const response = await axiosClient.post('/expenses', expenseData)
  return response.data // { success, message, data }
}
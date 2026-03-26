// src/routes/expenseRoutes.js — Mapa de rutas
// Este archivo SOLO conecta URLs con funciones del controlador.
// No tiene lógica de negocio. Es el "directorio" de la API.

const express = require('express');
const router = express.Router();
const { addExpense, getExpenses } = require('../controllers/expenseController');

// POST /api/expenses  → Crear un nuevo gasto
router.post('/', addExpense);

// GET  /api/expenses  → Obtener todos los gastos
router.get('/', getExpenses);

module.exports = router;
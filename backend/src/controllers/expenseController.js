// src/controllers/expenseController.js — Lógica de negocio
// Recibe las peticiones HTTP, las procesa y responde con JSON.
// Por ahora usa un array en memoria como base de datos temporal.
// Cuando conectemos MongoDB, solo cambia este archivo.

const { v4: uuidv4 } = require('uuid');

// 🗄️ Base de datos temporal en memoria
// Se reinicia cada vez que reinicias el servidor (es intencional por ahora)
let expenses = [];

// ── Categorías válidas ────────────────────────────────────────────
const VALID_CATEGORIES = [
  'alimentación',
  'transporte',
  'vivienda',
  'salud',
  'entretenimiento',
  'educación',
  'ropa',
  'otros',
];

// ─────────────────────────────────────────────────────────────────
// POST /api/expenses
// Body esperado: { description, amount, category, date? }
// ─────────────────────────────────────────────────────────────────
const addExpense = (req, res, next) => {
  try {
    const { description, amount, category, date } = req.body;

    // ── Validaciones ──────────────────────────────────────────────
    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'El campo "description" es obligatorio y debe ser texto.',
      });
    }

    if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'El campo "amount" es obligatorio y debe ser un número mayor a 0.',
      });
    }

    if (!category || !VALID_CATEGORIES.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `El campo "category" debe ser uno de: ${VALID_CATEGORIES.join(', ')}.`,
      });
    }

    // ── Crear el gasto ────────────────────────────────────────────
    const newExpense = {
      id: uuidv4(),                              // ID único
      description: description.trim(),
      amount: Number(amount),
      category: category.toLowerCase(),
      date: date ? new Date(date) : new Date(),  // Si no envían fecha, usa hoy
      createdAt: new Date(),
    };

    expenses.push(newExpense);

    return res.status(201).json({
      success: true,
      message: 'Gasto agregado correctamente.',
      data: newExpense,
    });

  } catch (error) {
    next(error); // Pasa el error al middleware global de errores
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/expenses
// Query params opcionales: ?category=alimentación&sort=desc
// ─────────────────────────────────────────────────────────────────
const getExpenses = (req, res, next) => {
  try {
    const { category, sort } = req.query;

    let result = [...expenses];

    // ── Filtro por categoría (opcional) ───────────────────────────
    if (category) {
      result = result.filter(
        (e) => e.category === category.toLowerCase()
      );
    }

    // ── Ordenar por fecha (más reciente primero por defecto) ───────
    result.sort((a, b) => {
      if (sort === 'asc') return new Date(a.date) - new Date(b.date);
      return new Date(b.date) - new Date(a.date); // desc (default)
    });

    // ── Calcular total ────────────────────────────────────────────
    const total = result.reduce((sum, e) => sum + e.amount, 0);

    // ── Agrupar totales por categoría ─────────────────────────────
    const byCategory = result.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      count: result.length,
      total: Number(total.toFixed(2)),
      byCategory,
      data: result,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { addExpense, getExpenses };
/**
 * authRoutes.js
 * Rutas públicas de autenticación con validaciones integradas.
 */

const express  = require('express')
const router   = express.Router()
const { register, login } = require('../controllers/authController')
const { requireFields, validateEmail } = require('../middlewares/validate')

// POST /api/auth/register
router.post(
  '/register',
  requireFields(['name', 'email', 'password']),
  validateEmail,
  register
)

// POST /api/auth/login
router.post(
  '/login',
  requireFields(['email', 'password']),
  validateEmail,
  login
)

module.exports = router
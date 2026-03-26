// src/controllers/authController.js
// Maneja registro e inicio de sesión.
// Genera un token JWT que el frontend usa en cada petición protegida.

const jwt  = require('jsonwebtoken')
const User = require('../models/User')

// ── Generar token JWT ─────────────────────────────────────────────
const generateToken = (userId) =>
  jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  )

// ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Body: { name, email, password }
// ─────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, email y contraseña son obligatorios',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres',
      })
    }

    // createUser lanza error si el email ya existe
    const user  = await User.createUser({ name, email, password })
    const token = generateToken(user.id)

    return res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
// ─────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son obligatorios',
      })
    }

    // Buscar usuario incluyendo la contraseña hasheada
    const user = User.findByEmail(email)

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      })
    }

    const isMatch = await User.matchPassword(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      })
    }

    const token = generateToken(user.id)

    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login }
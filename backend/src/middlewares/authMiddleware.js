// src/middlewares/authMiddleware.js
const jwt  = require('jsonwebtoken')
const User = require('../models/User')

const protect = (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'No autorizado, token no encontrado' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user    = User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ success: false, error: 'Usuario no encontrado' })
    }

    // Adjuntar usuario (sin contraseña) al request
    const { password: _, ...userWithoutPassword } = user
    req.user = userWithoutPassword
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { protect } 
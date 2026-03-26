// src/middlewares/errorHandler.js
// Middleware global de errores.
// Captura CUALQUIER error lanzado con next(error) en toda la app
// y responde siempre con el mismo formato JSON consistente.

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`❌ [${req.method}] ${req.path} →`, err.message)
  }

  let statusCode = err.statusCode || err.status || 500
  let message    = err.message    || 'Error interno del servidor'

  // ── Email duplicado ───────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 400
    message    = 'El email ya está registrado'
  }

  // ── Token JWT inválido ────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message    = 'Token inválido'
  }

  // ── Token JWT expirado ────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message    = 'Token expirado, inicia sesión nuevamente'
  }

  res.status(statusCode).json({
    success: false,
    error:   message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}

// ✅ Exporta la función directamente, no como objeto
module.exports = errorHandler
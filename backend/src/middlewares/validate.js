/**
 * validate.js
 * ─────────────────────────────────────────────────────────────
 * Middleware de validación centralizada.
 * Evita repetir validaciones en cada controlador.
 * Cada validador es una función que retorna middleware Express.
 */

/**
 * Valida los campos requeridos del body.
 * @param {string[]} fields — campos obligatorios
 */
const requireFields = (fields) => (req, res, next) => {
  const missing = fields.filter((f) => {
    const val = req.body[f]
    return val === undefined || val === null || val === ''
  })

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      error:   `Campos obligatorios faltantes: ${missing.join(', ')}`,
    })
  }
  next()
}

/**
 * Valida que el email tenga formato correcto.
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({
      success: false,
      error:   'El formato del email no es válido',
    })
  }
  next()
}

/**
 * Valida que el monto sea un número positivo.
 */
const validateAmount = (req, res, next) => {
  const { amount } = req.body
  if (amount !== undefined && (isNaN(amount) || Number(amount) <= 0)) {
    return res.status(400).json({
      success: false,
      error:   'El monto debe ser un número mayor a 0',
    })
  }
  next()
}

module.exports = { requireFields, validateEmail, validateAmount }
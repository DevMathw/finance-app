// server.js — Punto de entrada simplificado
// Sin MongoDB — arranca directo, los datos van a data/db.json

require('dotenv').config()

const app  = require('./src/app')
const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
  console.log(`💾 Base de datos: archivo local data/db.json`)
  console.log(`🌿 Entorno: ${process.env.NODE_ENV || 'development'}`)
})
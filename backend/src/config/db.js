// src/config/db.js
// Reemplaza MongoDB. Lee y escribe el archivo data/db.json.
// readDB()  → devuelve el objeto completo { users, transactions }
// writeDB() → guarda los cambios en el archivo

const fs   = require('fs')
const path = require('path')

const DB_PATH = path.join(__dirname, '../../data/db.json')

// Leer toda la base de datos
const readDB = () => {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch (error) {
    // Si el archivo no existe o está corrupto, devuelve estructura vacía
    return { users: [], transactions: [] }
  }
}

// Escribir toda la base de datos
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('❌ Error escribiendo la base de datos:', error.message)
    return false
  }
}

module.exports = { readDB, writeDB }

// src/models/User.js
// Funciones para manejar usuarios en el archivo JSON.
// Reemplaza el esquema de Mongoose — misma interfaz, sin base de datos.

const bcrypt        = require('bcryptjs')
const { v4: uuid }  = require('uuid')
const { readDB, writeDB } = require('../config/db')

// Buscar usuario por email
const findByEmail = (email) => {
  const db = readDB()
  return db.users.find((u) => u.email === email.toLowerCase()) || null
}

// Buscar usuario por ID
const findById = (id) => {
  const db = readDB()
  return db.users.find((u) => u.id === id) || null
}

// Crear un nuevo usuario
const createUser = async ({ name, email, password }) => {
  const db = readDB()

  // Verificar email duplicado
  if (db.users.some((u) => u.email === email.toLowerCase())) {
    const err = new Error('El email ya está registrado')
    err.statusCode = 400
    throw err
  }

  // Hashear contraseña
  const salt         = await bcrypt.genSalt(10)
  const hashedPass   = await bcrypt.hash(password, salt)

  const newUser = {
    id:        uuid(),
    name:      name.trim(),
    email:     email.toLowerCase().trim(),
    password:  hashedPass,
    createdAt: new Date().toISOString(),
  }

  db.users.push(newUser)
  writeDB(db)

  // Devolver sin contraseña
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

// Comparar contraseña ingresada con la hasheada
const matchPassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword)
}

module.exports = { findByEmail, findById, createUser, matchPassword }

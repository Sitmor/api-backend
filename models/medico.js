const mongoose = require('mongoose');
const medicoSchema = new mongoose.Schema({
    rut: String,
    nombre: String,
    apellido: String,
    contrasena: String,
    especialidad: String
});

module.exports = mongoose.model('medicos', medicoSchema);
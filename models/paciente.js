const mongoose = require('mongoose');
const pacienteSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    rut: String,
    nombre: String,
    apellido: String,
    contrasena: String,
    email: String,
});

module.exports = mongoose.model('pacientes', pacienteSchema);
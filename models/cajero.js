const mongoose = require('mongoose');
const medicoSchema = new mongoose.Schema({
    rut: String,
    nombre: String,
    apellido: String,
    contrasena: String,
});

module.exports = mongoose.model('cajeros', medicoSchema);
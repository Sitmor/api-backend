const mongoose = require('mongoose');
const secretariaSchema = new mongoose.Schema({
    rut: String,
    nombre: String,
    apellido: String,
    contrasena: String,

});

module.exports = mongoose.model('secretarias', secretariaSchema);
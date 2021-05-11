let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let loggerSchema = new Schema({
    type: {
        type: String,
        required: [true, "Debe tener al menos un tipo"],
        maxLength: [15, "El tipo debe tener como máximo 15 caracteres."],
        minLength: [1, "El tipo debe tener al menos 1 caracter."],
    },
    year: {
        type: Number,
        required: [true, "Debe tener al menos un año"],
        min: [2021, "El año no puede ser menor que 2021."],
        max: [3000, "El año no puede ser mayor que 3000."],
    },
    month: {
        type: Number,
        required: [true, "Debe tener al menos un mes"],
        max: [12, "El mes no puede ser mayor que 12."],
        min: [1, "El mes no puede ser menor que 1."],
    },
    propertyType: {
        type: String,
        required: [true, "Debe tener al menos un tipo de propiedad"],
        maxLength: [15, "El tipo de propiedad no puede tener mas de 15 caracteres."],
        minLength: [1, "El tipo de propiedad no puede tener menos 1 caracter."],
    },
}, {collection: "logger"});


module.exports = mongoose.model('loggerModel', loggerSchema);
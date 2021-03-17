let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let propertyMinSchema = new Schema({
    // Comunes para todos
    type: {type: String, required: true},
    code: {type: String, required: true},
    typeOp: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    city: {type: String, required: true},
    area: {type: Number, required: true},
    price:  {type: Number,required: true},
    media: [],
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'ownerModel'
    },

    // Vivienda
    address: String,
    floor: Number,
    numHabs: Number,
    numBan: Number,
    priceCom: Number,
    garaje: Boolean,
    piscina: Boolean,
    terraza: Boolean,
    trastero: Boolean,
    jardin: Boolean,
    ascensor: Boolean,
    calefaccion: Boolean,
    aireAcon: Boolean,
    amueblado: Boolean,
    animales: Boolean,

    // Suelo
    situation: String,
    edifArea: String,
    accesoAgua: Boolean,
    accesoLuz: Boolean,

    // Local
    numAseos: Number,
    escaparate: Boolean,
    aparcamiento: Boolean,
    cargaYdescarga: Boolean,
    extintores: Boolean,
    iluminacion: Boolean,
}, {collection: "properties"});


module.exports = mongoose.model('propertyMinModel', propertyMinSchema);
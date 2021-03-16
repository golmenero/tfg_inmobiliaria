let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let viviendaSchema = new Schema({
    type: {type: String, required: true},
    code: {type: String, required: true},
    typeOp: {type: String, required: true},
    name: {type: String, required: true},
    address: {type: String, required: true},
    floor: {type: Number, required: true},
    description: {type: String, required: true},
    city: {type: String, required: true},
    area: {type: Number, required: true},
    numHabs: {type: Number, required: true},
    numBan: {type: Number, required: true},
    price: {type: Number, required: true},
    priceCom: {type: Number, required: true},
    garaje: {type: Boolean, required: true},
    piscina: {type: Boolean, required: true},
    terraza: {type: Boolean, required: true},
    trastero: {type: Boolean, required: true},
    jardin: {type: Boolean, required: true},
    ascensor: {type: Boolean, required: true},
    calefaccion: {type: Boolean, required: true},
    aireAcon: {type: Boolean, required: true},
    amueblado: {type: Boolean, required: true},
    animales: {type: Boolean, required: true},
    media: [],
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'ownerModel'
    }
}, {collection: "properties"});


module.exports = mongoose.model('viviendaModel', viviendaSchema);
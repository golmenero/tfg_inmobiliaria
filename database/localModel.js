let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let localSchema = new Schema({
    type: {type: String, required: true},
    code: {type: String, required: true},
    typeOp: {type: String, required: true},
    name: {type: String, required: true},
    address: {type: String, required: true},
    floor: {type: Number, required: true},
    description: {type: String, required: true},
    city: {type: String, required: true},
    area: {type: Number, required: true},
    numAseos: {type: Number, required: true},
    price: {type: Number, required: true},
    priceCom: {type: Number, required: true},
    escaparate: {type: Boolean, required: true},
    aparcamiento: {type: Boolean, required: true},
    cargaYdescarga: {type: Boolean, required: true},
    extintores: {type: Boolean, required: true},
    iluminacion: {type: Boolean, required: true},
    calefaccion: {type: Boolean, required: true},
    aireAcon: {type: Boolean, required: true},
    media: [],
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'ownerModel'
    }
}, {collection: "properties"});


module.exports = mongoose.model('localModel', localSchema);
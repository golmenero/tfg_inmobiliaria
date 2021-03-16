let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let sueloSchema = new Schema({
    type: {type: String, required: true},
    code: {type: String, required: true},
    typeOp: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    city: {type: String, required: true},
    situation: {type: String, required: true},
    area: {type: Number, required: true},
    edifArea: {type: Number, required: true},
    price: {type: Number, required: true},
    accesoAgua: {type: Boolean, required: true},
    accesoLuz: {type: Boolean, required: true},
    media: [],
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'ownerModel'
    }
}, {collection: "properties"});


module.exports = mongoose.model('sueloModel', sueloSchema);
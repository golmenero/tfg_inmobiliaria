let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ownerSchema = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    dni: {type: String, required: true},
    phone: {type: Number, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
}, {collection: "owners"});


module.exports = mongoose.model('ownerModel', ownerSchema);
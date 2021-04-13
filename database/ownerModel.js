let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ownerSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 20,
        minLength: 2
    },
    surname: {
        type: String,
        required: true,
        maxLength: 30,
        minLength: 2
    },
    dni: {
        type: String,
        required: true,
        maxLength: 15,
        minLength: 8,
    },
    phone: {
        type: Number,
        required: true,
        maxLength: 15,
        minLength: 9,
    },
    email: {
        type: String,
        required: true,
        maxLength: 50,
        minLength: 8,
    },
    address: {
        type: String,
        required: true,
        maxLength: 50,
        minLength: 5,
    },
}, {collection: "owners"});


module.exports = mongoose.model('ownerModel', ownerSchema);
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let infoSchema = new Schema({
    phones: {
        type: String,
        maxLength: [255, "Los teléfonos no pueden superar los 255 caracteres."]
    },
    emails: {
        type: String,
        maxLength: [255, "Los emails no pueden superar los 255 caracteres."]
    },
    active: {
        type: Boolean,
        required: true
    },
}, {collection: "info"});


module.exports = mongoose.model('infoModel', infoSchema);
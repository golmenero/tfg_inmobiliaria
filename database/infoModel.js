let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let infoSchema = new Schema({
    phones: {
        type: String,
        required: true,
        maxLength: 255,
        minLength: 10
    },
    emails: {
        type: String,
        required: true,
        maxLength: 255,
        minLength: 10
    },
    active: {
        type: Boolean,
        required: true
    },
}, {collection: "info"});


module.exports = mongoose.model('infoModel', infoSchema);
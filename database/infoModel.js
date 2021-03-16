let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let infoSchema = new Schema({
    phones: {type: String, required: true},
    emails: {type: String, required: true},
    active: {type: Boolean, required: true},
}, {collection: "info"});


module.exports = mongoose.model('infoModel', infoSchema);
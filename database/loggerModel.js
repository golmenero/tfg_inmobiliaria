let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let loggerSchema = new Schema({
    type: {type: String, required: true},
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    propertyType: {type: String, required: true},
}, {collection: "logger"});


module.exports = mongoose.model('loggerModel', loggerSchema);
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let loggerSchema = new Schema({
    type: {
        type: String,
        required: true,
        maxLength: 15,
        minLength: 1
    },
    year: {
        type: Number,
        required: true,
        min: 2021,
    },
    month: {
        type: Number,
        required: true,
        max: 12,
        min: 1
    },
    propertyType: {
        type: String,
        required: true,
        maxLength: 15,
        minLength: 1
    },
}, {collection: "logger"});


module.exports = mongoose.model('loggerModel', loggerSchema);
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let agentSchema = new Schema({
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
    email: {
        type: String,
        required: true,
        maxLength: 50,
        minLength: 2
    },
    permission: {
        type: String,
        required: true,
        maxLength: 1,
        minLength: 1
    },
    password: {
        type: String,
        required: true,
        maxLength: 255,
        minLength: 5
    },
    active: {type: Boolean, required: true},
}, {collection: "users"});


module.exports = mongoose.model('agentModel', agentSchema);
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let agentSchema = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true},
    permission: {type: String, required: true},
    password: {type: String, required: true},
    active: {type: Boolean, required: true},
}, {collection: "users"});


module.exports = mongoose.model('agentModel', agentSchema);
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true},
    permission: {type: String, required: true},
    password: {type: String, required: true},
    active: {type: Boolean, required: true},
    codes: {
        emailActivation: {type: String},
        passwordRecover: {type: String},
        passwordRecoverDate: {type: String},
    },
    wishes: [],
}, {collection: "users"});


module.exports = mongoose.model('userModel', userSchema);
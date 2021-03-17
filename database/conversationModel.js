let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let conversationSchema = new Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'agentModel'
    },
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'userModel'
    },
    property: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'propertyMinModel'
    },
    messages: [],
}, {collection: "conversations"});


module.exports = mongoose.model('conversationModel', conversationSchema);
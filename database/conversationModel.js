let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let conversationSchema = new Schema({
    agent: {
        required: [true, "Debe tener al menos un agente"],
        type: mongoose.Schema.Types.ObjectID,
        ref: 'agentModel'
    },
    user: {
        required: [true, "Debe tener al menos un usuario"],
        type: mongoose.Schema.Types.ObjectID,
        ref: 'userModel'
    },
    property: {
        required: [true, "Debe tener al menos una propiedad"],
        type: mongoose.Schema.Types.ObjectID,
        ref: 'propertyMinModel'
    },
    messages: [],
}, {collection: "conversations"});


module.exports = mongoose.model('conversationModel', conversationSchema);
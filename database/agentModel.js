let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let agentSchema = new Schema({
    name: {
        type: String,
        required: [true, "Debe tener al menos un nombre"],
        maxLength: [20,"El nombre no puede tener más de 20 letras."],
        minLength: [2,"El nombre no puede tener menos de 2 letras."],
    },
    surname: {
        type: String,
        required: [true,"Debe tener al menos un apellido"],
        maxLength:  [30,"El apellido no puede tener más de 30 letras."],
        minLength: [2,"El apellido no puede tener menos de 2 letras."],
    },
    email: {
        type: String,
        required: [true,"Debe tener al menos un email"],
        maxLength: [50,"El correo electrónico no puede tener más de 50 letras."],
        minLength: [8,"El correo electrónico no puede tener menos de 8 letras."],
    },
    permission: {
        type: String,
        required: [true,"Debe tener al menos un permiso"],
        maxLength: [1,"El permiso debe tener exactamente una letra."],
        minLength: [1,"El permiso debe tener exactamente una letra."],
    },
    password: {
        iv: {
            type: String,
            required: [true, "Debe tener al menos una contraseña"],
            maxLength: [100, "La contraseña debe tener menos de 100 caracteres."],
            minLength: [8, "La contraseña debe tener al menos 8 caracteres."],
        },
        encryptedData: {
            type: String,
            required: [true, "Debe tener al menos una contraseña"],
            maxLength: [100, "La contraseña debe tener menos de 100 caracteres."],
            minLength: [8, "La contraseña debe tener al menos 8 caracteres."],
        }
    },
    active: {
        type: Boolean,
        required: [true,"Debe tener al menos un estado"],
    },
}, {collection: "users"});


module.exports = mongoose.model('agentModel', agentSchema);
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ownerSchema = new Schema({
    name: {
        type: String,
        required: [true, "El propietario debe tener un nombre."],
        maxLength: [20,"El nombre no debe tener mas de 20 caracteres."],
        minLength: [2, "El nombre no debe tener menos de 2 caracteres."]
    },
    surname: {
        type: String,
        required: [true, "El propietario debe tener un apellido."],
        maxLength: [30,"El apellido no debe tener mas de 30 caracteres."],
        minLength: [2, "El apellido no debe tener menos de 2 caracteres."]
    },
    dni: {
        type: String,
        required: [true, "El propietario debe tener un DNI."],
        maxLength: [15,"El DNI no debe tener mas de 15 caracteres."],
        minLength: [8,"El DNI no debe tener menos de 8 caracteres."]
    },
    phone: {
        type: Number,
        required: [true, "El propietario debe tener un teléfono."],
        max: [999999999,"El teléfono no debe ser superior a 999999999."],
        min: [111111111,"El teléfono no debe ser inferior a 111111111."]
    },
    email: {
        type: String,
        required: [true, "El propietario debe tener un e-mail."],
        maxLength: [50,"El e-mail no debe tener mas de 50 caracteres."],
        minLength: [8,"El e-mail no debe tener menos de 8 caracteres."]
    },
    address: {
        type: String,
        required: [true, "El propietario debe tener una dirección."],
        maxLength: [50,"La dirección no debe tener mas de 50 caracteres."],
        minLength: [5,"La direccion no debe tener menos de 5 caracteres."]
    },
}, {collection: "owners"});


module.exports = mongoose.model('ownerModel', ownerSchema);
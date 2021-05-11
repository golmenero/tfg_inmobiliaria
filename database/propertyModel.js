let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let propertyMinSchema = new Schema({
        // Comunes para todos
        type: {
            type: String,
            required: [true, "La propiedad debe tener un tipo."],
            maxLength: [30, "El tipo no debe tener más de 30 caracteres."],
            minLength: [2, "El tipo no debe tener menos de 2 caracteres."],
        },
        code: {
            type: String,
            required: [true, "La propiedad debe tener un código."],
            maxLength: [10, "El código no debe tener más de 10 caracteres."],
            minLength: [1, "El código no debe tener menos de 1 caracter."],
        },
        typeOp: {
            type: String,
            required: [true, "La propiedad debe tener un tipo de operación."],
            maxLength: [10, "El tipo de operación no debe tener más de 10 caracteres."],
            minLength: [2, "El tipo de operación no debe tener menos de 2 caracteres."],
        },
        name: {
            type: String,
            required: [true, "La propiedad debe tener un nombre."],
            maxLength: [30, "El nombre no debe tener más de 30 caracteres."],
            minLength: [4, "El nombre no debe tener menos de 4 caracteres."],
        },
        description: {
            type: String,
            required: [true, "La propiedad debe tener una descripción."],
            maxLength: [255, "La descripción no debe tener más de 255 caracteres."],
            minLength: [5, "La descripción no debe tener menos de 5 caracteres."],
        },
        city: {
            type: String,
            required: [true,  "La propiedad debe tener una ciudad."],
            maxLength: [25, "La ciudad no debe tener más de 15 caracteres."],
            minLength: [2, "La ciudad no debe tener menos de 2 caracteres."],
        },
        area: {
            type: Number,
            required: [true,  "La propiedad debe tener una superficie."],
            max: [10000000, "La superficie no debe ser superior a 10000000."],
            min: [10, "La superficie no debe ser inferior a 10."],
        },
        price: {
            type: Number,
            required: [true, "La propiedad debe tener un precio."],
            max: [10000000, "El precio no debe ser superior a 10000000."],
            min: [0, "El precio no debe ser inferior a 0."],
        },
        media: [],
        owner: {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'ownerModel'
        },

        // Vivienda
        address: {
            type: String,
            maxLength: [50, "La dirección no debe tener más de 50 caracteres."],
            minLength: [5, "La dirección no debe tener menos de 5 caracteres."],
        },
        floor: {
            type: Number,
            max: [10000,"El piso no debe ser superior a 10000."],
            min: [0, "El piso no debe ser inferior a 0."],
        },
        numHabs: {
            type: Number,
            max: [4, "El número de habitaciones no debe ser superior a 100."],
            min: [1, "El número de habitaciones no debe ser inferior a 0."],
        },
        numBan: {
            type: Number,
            max: [4, "El número de baños no debe ser superior a 100."],
            min: [1, "El número de baños no debe ser inferior a 0."],
        },
        priceCom: {
            type: Number,
            max: [10000, "El precio de comunidad no debe ser superior a 10000."],
            min: [0, "El precio de comunidad no debe ser inferior a 0."],
        },
        garaje: Boolean,
        piscina: Boolean,
        terraza: Boolean,
        trastero: Boolean,
        jardin: Boolean,
        ascensor: Boolean,
        calefaccion: Boolean,
        aireAcon: Boolean,
        amueblado: Boolean,
        animales: Boolean,

        // Suelo
        situation: {
            type:String,
            maxLength: [50,"La situación no debe tener más de 50 caracteres."],
            minLength: [5, "La situación no debe tener menos de 5 caracteres."],
        },
        edifArea: {
            type:Number,
            max: [10000000, "El área edificable no debe ser superior a 10000000."],
            min: [0, "El área edificable no debe ser inferior a 0."],
        },
        accesoAgua: Boolean,
        accesoLuz: Boolean,

        // Local
        numAseos: {
            type:Number,
            max: [4,"El número de aseos no debe ser superior a 4."],
            min: [1, "El número de aseos no debe ser inferior a 1."],
        },
        escaparate: Boolean,
        aparcamiento: Boolean,
        cargaYdescarga: Boolean,
        extintores: Boolean,
        iluminacion: Boolean,
    },
    {
        collection: "properties"
    }
    )
;


module.exports = mongoose.model('propertyMinModel', propertyMinSchema);
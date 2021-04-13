let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let propertyMinSchema = new Schema({
        // Comunes para todos
        type: {
            type: String,
            required: true,
            maxLength: 30,
            minLength: 2,
        },
        code: {
            type: String,
            required: true,
            maxLength: 10,
            minLength: 1,
        },
        typeOp: {
            type: String,
            required: true,
            maxLength: 10,
            minLength: 2,
        },
        name: {
            type: String,
            required: true,
            maxLength: 30,
            minLength: 4,
        },
        description: {
            type: String,
            required: true,
            maxLength: 255,
            minLength: 30,
        },
        city: {
            type: String,
            required: true,
            maxLength: 15,
            minLength: 2,
        },
        area: {
            type: Number,
            required: true,
            max: 10000000,
            min: 10,
        },
        price: {
            type: Number,
            required: true,
            max: 10000000,
            min: 0,
        },
        media: [],
        owner: {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'ownerModel'
        },

        // Vivienda
        address: {
            type: String,
            maxLength: 50,
            minLength: 5,
        },
        floor: {
            type: Number,
            max: 10000,
            min: 0,
        },
        numHabs: {
            type: Number,
            max: 1000,
            min: 0,
        },
        numBan: {
            type: Number,
            max: 1000,
            min: 0,
        },
        priceCom: {
            type: Number,
            max: 10000,
            min: 0,
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
            maxLength: 50,
            minLength: 5,
        },
        edifArea: {
            type:Number,
            max: 10000000,
            min: 10,
        },
        accesoAgua: Boolean,
        accesoLuz: Boolean,

        // Local
        numAseos: {
            type:Number,
            max: 1000,
            min: 10,
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
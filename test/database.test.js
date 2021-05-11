// ABRIMOS LA CONEXIÓN
require('../database/connection.js')

// NECESITAMOS LOS MODELOS PARA COMPROBAR TODAS LAS OPERACIONES
let agentModel = require('../database/agentModel')
let conversationModel = require('../database/conversationModel')
let infoModel = require('../database/infoModel')
let loggerModel = require('../database/loggerModel')
let ownerModel = require('../database/ownerModel')
let propertyModel = require('../database/propertyModel')
let userModel = require('../database/userModel')

let utilities = require('../help/utilities')
let mongoose = require('mongoose')

beforeAll(async () =>{
    await agentModel.deleteMany();
    await conversationModel.deleteMany();
    await infoModel.deleteMany();
    await loggerModel.deleteMany();
    await ownerModel.deleteMany();
    await propertyModel.deleteMany();
    await userModel.deleteMany();
})

afterEach(async () => {
    await agentModel.deleteMany();
    await conversationModel.deleteMany();
    await infoModel.deleteMany();
    await loggerModel.deleteMany();
    await ownerModel.deleteMany();
    await propertyModel.deleteMany();
    await userModel.deleteMany();
})

test('MODELO AGENT, POS - Datos Correctos', async () => {
    let agente1 = {
        name: "NewAgente1",
        surname: "NewAgentito1",
        email: "newagente1@newagente.com",
        permission: "A",
        password: "c45bbb35d6d56f860eb7b8b6ab21a95cd06bf233a79cac2a7b07f779198e7f33",
        active: true
    }
    let agenteM = new agentModel(agente1);
    let result = await agenteM.validateSync();
    expect(result).toBeUndefined();
});

test('MODELO AGENT, NEG - Campos Requeridos', async () => {
    let agente1 = {}
    let agenteM = new agentModel(agente1);
    let result = await agenteM.validateSync();
    // Comprobamos que el resultado es correcto
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("Debe tener al menos un nombre")
    expect(errors).toContain("Debe tener al menos un apellido")
    expect(errors).toContain("Debe tener al menos un email")
    expect(errors).toContain("Debe tener al menos un permiso")
    expect(errors).toContain("Debe tener al menos una contraseña")
    expect(errors).toContain("Debe tener al menos un estado")
});

test('MODELO AGENT, NEG - Tamaños Máximos', async () => {
    let agente1 = {
        name: longString(),
        surname: longString(),
        email: longString(),
        permission: "AA",
        password: longString(),
        active: true
    }
    let agenteM = new agentModel(agente1);
    let result = await agenteM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El nombre no puede tener más de 20 letras.")
    expect(errors).toContain("El apellido no puede tener más de 30 letras.")
    expect(errors).toContain("El correo electrónico no puede tener más de 50 letras.")
    expect(errors).toContain("El permiso debe tener exactamente una letra.")
    expect(errors).toContain("La contraseña debe tener menos de 100 caracteres.")
});

test('MODELO AGENT, NEG - Tamaños Mínimos', async () => {
    let agente1 = {
        name: "A",
        surname: "A",
        email: "A",
        permission: "A",
        password: "A",
        active: true
    }
    let agenteM = new agentModel(agente1);
    let result = await agenteM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El nombre no puede tener menos de 2 letras.")
    expect(errors).toContain("El apellido no puede tener menos de 2 letras.")
    expect(errors).toContain("El correo electrónico no puede tener menos de 8 letras.")
    expect(errors).toContain("La contraseña debe tener al menos 8 caracteres.")
});

test('MODELO CONVERSATION, POS - Datos Correctos', async () => {
    let owner = {
        name: "Propietario 1",
        surname: "Apellido Propietario 1",
        dni: "00000000A",
        phone: 666666666,
        email: "propietario1@propietario.com",
        address: "Direccion Propietario 1",
    }
    let ownerM = new ownerModel(owner);
    await ownerM.save();
    let ownerId = ownerM._id;

    let property1 = {
        type: "vivienda",
        code: "VP01",
        typeOp: "Venta",
        name: "Vivienda 1",
        address: "Calle Vivienda 1",
        floor: 3,
        description: "Descripcion Vivienda 1",
        city: "Ciudad Vivienda 1",
        area: 100,
        numHabs: 2,
        numBan: 1,
        price: 1000,
        priceCom: 100,
        garaje: true,
        piscina: false,
        terraza: true,
        trastero: false,
        jardin: true,
        ascensor: false,
        calefaccion: true,
        aireAcon: false,
        amueblado: true,
        animales: false,
        media: [],
        owner: mongoose.mongo.ObjectID(ownerId)
    }
    let propertyM1 = new propertyModel(property1);
    await propertyM1.save();
    let propertyId1 = propertyM1._id;

    let agente1 = {
        name: "Agente1",
        surname: "Agentito1",
        email: "agente1@agente.com",
        permission: "A",
        password: "c45bbb35d6d56f860eb7b8b6ab21a95cd06bf233a79cac2a7b07f779198e7f33",
        active: true
    }
    let agenteM1 = new agentModel(agente1);
    await agenteM1.save();
    let agenteId1 = agenteM1._id;

    let usuario1 = {
        name: "Usuario1",
        surname: "Usuarito1",
        email: "usuario1@usuario.com",
        permission: "U",
        password: "c45bbb35d6d56f860eb7b8b6ab21a95cd06bf233a79cac2a7b07f779198e7f33",
        active: true,
        wishes: [propertyId1],
        codes: {
            emailActivation: "",
            passwordRecover: "",
        },
    }
    let usuarioM1 = new userModel(usuario1);
    await usuarioM1.save();
    let usuarioId1 = usuarioM1._id;

    let conversation = {
        messages: [{
            from: "U",
            text: "General Kenobi",
            date: "24,04",
            time: "22:44",
            seen: false
        }],
        user: usuarioId1,
        agent: agenteId1,
        property: propertyId1,
    }
    let conversationM = new conversationModel(conversation);
    let result = await conversationM.validateSync();
    expect(result).toBeUndefined();
});

test('MODELO CONVERSATION, NEG - Campos Requeridos', async () => {
    let conversation = {
        messages: [{
            from: "U",
            text: "General Kenobi",
            date: "24,04",
            time: "22:44",
            seen: false
        }],
    }
    let conversationM = new conversationModel(conversation);
    let result = await conversationM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("Debe tener al menos un agente")
    expect(errors).toContain("Debe tener al menos un usuario")
    expect(errors).toContain("Debe tener al menos una propiedad")
});

test('MODELO INFO, POS - Datos Correctos', async () => {
    let info = {
        phones: "Teléfono de Prueba",
        emails: "Correos de Prueba",
        active: true,
    }
    let infoM = new infoModel(info);
    let result = await infoM.validateSync();
    expect(result).toBeUndefined();
});

test('MODELO INFO, NEG - Tamaños Máximos', async () => {
    let info = {
        phones: longString(),
        emails: longString(),
        active: true,
    }
    let infoM = new infoModel(info);
    let result = await infoM.validateSync();
    // Comprobamos que el resultado es correcto

    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("Los teléfonos no pueden superar los 255 caracteres.")
    expect(errors).toContain("Los emails no pueden superar los 255 caracteres.")
});

test('MODELO LOGGER, POS - Datos Correctos', async () => {
    let logger = {
        type: "wish",
        year: 2022,
        month: 10,
        propertyType: "alquiler",
    }
    let loggerM = new loggerModel(logger);
    let result = await loggerM.validateSync();
    expect(result).toBeUndefined();
});

test('MODELO LOGGER, NEG - Campos Requeridos', async () => {
    let logger = {}
    let loggerM = new loggerModel(logger);
    let result = await loggerM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("Debe tener al menos un tipo")
    expect(errors).toContain("Debe tener al menos un año")
    expect(errors).toContain("Debe tener al menos un mes")
    expect(errors).toContain("Debe tener al menos un tipo de propiedad")
});

test('MODELO LOGGER, NEG - Tamaños Máximos', async () => {
    let logger = {
        type: longString(),
        year: longNumber(),
        month: longNumber(),
        propertyType: longString(),
    }
    let loggerM = new loggerModel(logger);
    let result = await loggerM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El tipo debe tener como máximo 15 caracteres.")
    expect(errors).toContain("El año no puede ser mayor que 3000.")
    expect(errors).toContain("El mes no puede ser mayor que 12.")
    expect(errors).toContain("El tipo de propiedad no puede tener mas de 15 caracteres.")
});

test('MODELO LOGGER, NEG - Tamaños Mínimos', async () => {
    let logger = {
        type: "wish",
        year: 10,
        month: 0,
        propertyType: "vivienda",
    }
    let loggerM = new loggerModel(logger);
    let result = await loggerM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El año no puede ser menor que 2021.")
    expect(errors).toContain("El mes no puede ser menor que 1.")
});

test('MODELO OWNER, POS - Datos Correctos', async () => {
    let owner = {
        name: "Propietario 1",
        surname: "Apellido Propietario 1",
        dni: "00000000A",
        phone: 666666666,
        email: "propietario1@propietario.com",
        address: "Direccion Propietario 1",
    }
    let ownerM = new ownerModel(owner);
    let result = await ownerM.validateSync();
    expect(result).toBeUndefined();
});

test('MODELO OWNER, POS - Campos Requeridos', async () => {
    let owner = {}
    let ownerM = new ownerModel(owner);
    let result = await ownerM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El propietario debe tener un nombre.")
    expect(errors).toContain("El propietario debe tener un apellido.")
    expect(errors).toContain("El propietario debe tener un DNI.")
    expect(errors).toContain("El propietario debe tener un teléfono.")
    expect(errors).toContain("El propietario debe tener un e-mail.")
    expect(errors).toContain("El propietario debe tener una dirección.")
});

test('MODELO OWNER, NEG - Tamaños Máximos', async () => {
    let owner = {
        name: longString(),
        surname: longString(),
        dni: longString(),
        phone: longNumber(),
        email: longString(),
        address: longString(),
    }
    let ownerM = new ownerModel(owner);
    let result = await ownerM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El nombre no debe tener mas de 20 caracteres.")
    expect(errors).toContain("El apellido no debe tener mas de 30 caracteres.")
    expect(errors).toContain("El DNI no debe tener mas de 15 caracteres.")
    expect(errors).toContain("El teléfono no debe ser superior a 999999999.")
    expect(errors).toContain("El e-mail no debe tener mas de 50 caracteres.")
    expect(errors).toContain("La dirección no debe tener mas de 50 caracteres.")
});

test('MODELO OWNER, NEG - Tamaños Mínimos', async () => {
    let owner = {
        name: "A",
        surname: "A",
        dni: "A",
        phone: 0,
        email: "A",
        address: "A",
    }
    let ownerM = new ownerModel(owner);
    let result = await ownerM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El nombre no debe tener menos de 2 caracteres.")
    expect(errors).toContain("El apellido no debe tener menos de 2 caracteres.")
    expect(errors).toContain("El DNI no debe tener menos de 8 caracteres.")
    expect(errors).toContain("El teléfono no debe ser inferior a 111111111.")
    expect(errors).toContain("El e-mail no debe tener menos de 8 caracteres.")
    expect(errors).toContain("La direccion no debe tener menos de 5 caracteres.")
});

test('MODELO USER, POS - Datos Correctos', async () => {
    let user1 = {
        name: "NewUser1",
        surname: "NewUsercito1",
        email: "newuser1@newuser.com",
        permission: "A",
        password: "c45bbb35d6d56f860eb7b8b6ab21a95cd06bf233a79cac2a7b07f779198e7f33",
        active: true,
        codes: {
            emailActivation:"",
            passwordRecover:"",
        },
        wishes: []
    }
    let userM = new agentModel(user1);
    let result = await userM.validateSync();
    expect(result).toBeUndefined();
});

test('MODELO USER, NEG - Campos Requeridos', async () => {
    let user1 = {}
    let userM = new agentModel(user1);
    let result = await userM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("Debe tener al menos un nombre")
    expect(errors).toContain("Debe tener al menos un apellido")
    expect(errors).toContain("Debe tener al menos un email")
    expect(errors).toContain("Debe tener al menos un permiso")
    expect(errors).toContain("Debe tener al menos una contraseña")
    expect(errors).toContain("Debe tener al menos un estado")
});

test('MODELO USER, NEG - Tamaños Máximos', async () => {
    let user1 = {
        name: longString(),
        surname: longString(),
        email: longString(),
        permission: 'AA',
        password: longString(),
        active: true,
        codes: {
            emailActivation: longString(),
            passwordRecover: longString(),
        },
        wishes: []
    }
    let userM = new agentModel(user1);
    let result = await userM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El nombre no puede tener más de 20 letras.")
    expect(errors).toContain("El apellido no puede tener más de 30 letras.")
    expect(errors).toContain("El correo electrónico no puede tener más de 50 letras.")
    expect(errors).toContain("El permiso debe tener exactamente una letra.")
    expect(errors).toContain("La contraseña debe tener menos de 100 caracteres.")
});

test('MODELO USER, NEG - Tamaños Mínimos', async () => {
    let user1 = {
        name: "A",
        surname: "A",
        email: "A",
        password: "A"
    }
    let userM = new agentModel(user1);
    let result = await userM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El nombre no puede tener menos de 2 letras.")
    expect(errors).toContain("El apellido no puede tener menos de 2 letras.")
    expect(errors).toContain("El correo electrónico no puede tener menos de 8 letras.")
    expect(errors).toContain("La contraseña debe tener al menos 8 caracteres.")
});

test('MODELO PROPERTY / VIVIENDA, POS - Datos Correctos', async () => {
    let owner = {
        name: "Propietario 1",
        surname: "Apellido Propietario 1",
        dni: "00000000A",
        phone: 666666666,
        email: "propietario1@propietario.com",
        address: "Direccion Propietario 1",
    }
    let ownerM = new ownerModel(owner);
    await ownerM.save();
    let ownerId = ownerM._id;

    let property1 = {
        type: "vivienda",
        code: "VP01",
        typeOp: "Venta",
        name: "Vivienda 1",
        address: "Calle Vivienda 1",
        floor: 3,
        description: "Descripcion Vivienda 1",
        city: "Ciudad Vivienda 1",
        area: 100,
        numHabs: 2,
        numBan: 1,
        price: 1000,
        priceCom: 100,
        garaje: true,
        piscina: false,
        terraza: true,
        trastero: false,
        jardin: true,
        ascensor: false,
        calefaccion: true,
        aireAcon: false,
        amueblado: true,
        animales: false,
        media: [],
        owner: mongoose.mongo.ObjectID(ownerId)
    }
    let propertyM = new propertyModel(property1);
    let result = await propertyM.validateSync();
    expect(result).toBeUndefined();
});

test('MODELO PROPERTY / LOCAL, POS - Datos Correctos', async () => {
    let owner = {
        name: "Propietario 1",
        surname: "Apellido Propietario 1",
        dni: "00000000A",
        phone: 666666666,
        email: "propietario1@propietario.com",
        address: "Direccion Propietario 1",
    }
    let ownerM = new ownerModel(owner);
    await ownerM.save();
    let ownerId = ownerM._id;

    let property1 = {
        type: "local",
        code: "LP01",
        typeOp: "Venta",
        name: "Local 1",
        address: "Calle Local 1",
        floor: 3,
        description: "Descripcion Local 1",
        city: "Ciudad Local 1",
        area: 500,
        numAseos: 2,
        price: 1000,
        priceCom: 100,
        escaparate: true,
        aparcamiento: false,
        cargaYdescarga: true,
        extintores: false,
        iluminacion: true,
        calefaccion: false,
        aireAcon: true,
        media: [],
        owner: mongoose.mongo.ObjectID(ownerId)
    }
    let propertyM = new propertyModel(property1);
    let result = await propertyM.validateSync();
    expect(result).toBeUndefined();
});

test('MODELO PROPERTY / SUELO, POS - Datos Correctos', async () => {
    let owner = {
        name: "Propietario 1",
        surname: "Apellido Propietario 1",
        dni: "00000000A",
        phone: 666666666,
        email: "propietario1@propietario.com",
        address: "Direccion Propietario 1",
    }
    let ownerM = new ownerModel(owner);
    await ownerM.save();
    let ownerId = ownerM._id;

    let property1 = {
        type: "suelo",
        code: "SP01",
        typeOp: "Alquiler",
        name: "Suelo 1",
        description: "Descripcion Suelo 1",
        city: "Ciudad Suelo 1",
        situation: "Situacion Suelo 1",
        area: 500,
        edifArea: 250,
        price: 10000,
        accesoAgua: true,
        accesoLuz: false,
        media: [],
        owner: mongoose.mongo.ObjectID(ownerId)
    }
    let propertyM = new propertyModel(property1);
    let result = await propertyM.validateSync();
    expect(result).toBeUndefined();
});

test('MODELO PROPERTY, NEG - Campos Requeridos', async () => {
    let owner = {
        name: "Propietario 1",
        surname: "Apellido Propietario 1",
        dni: "00000000A",
        phone: 666666666,
        email: "propietario1@propietario.com",
        address: "Direccion Propietario 1",
    }
    let ownerM = new ownerModel(owner);
    await ownerM.save();
    let ownerId = ownerM._id;

    let property1 = {}
    let propertyM = new propertyModel(property1);
    let result = await propertyM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("La propiedad debe tener un tipo.")
    expect(errors).toContain("La propiedad debe tener un código.")
    expect(errors).toContain("La propiedad debe tener un tipo de operación.")
    expect(errors).toContain("La propiedad debe tener un nombre.")
    expect(errors).toContain("La propiedad debe tener una descripción.")
    expect(errors).toContain("La propiedad debe tener una ciudad.")
    expect(errors).toContain("La propiedad debe tener una superficie.")
    expect(errors).toContain("La propiedad debe tener un precio.")
});

test('MODELO PROPERTY / VIVIENDA, POS - Tamaños Máximos', async () => {
    let owner = {
        name: "Propietario 1",
        surname: "Apellido Propietario 1",
        dni: "00000000A",
        phone: 666666666,
        email: "propietario1@propietario.com",
        address: "Direccion Propietario 1",
    }
    let ownerM = new ownerModel(owner);
    await ownerM.save();
    let ownerId = ownerM._id;

    let property1 = {
        type: longString(),
        code: longString(),
        typeOp: longString(),
        name: longString(),
        address: longString(),
        floor: longNumber(),
        description: longString(),
        city: longString(),
        area: longNumber(),
        numHabs: longNumber(),
        numBan: longNumber(),
        price: longNumber(),
        priceCom: longNumber(),
        garaje: true,
        piscina: false,
        terraza: true,
        trastero: false,
        jardin: true,
        ascensor: false,
        calefaccion: true,
        aireAcon: false,
        amueblado: true,
        animales: false,
        media: [],
        owner: mongoose.mongo.ObjectID(ownerId)
    }
    let propertyM = new propertyModel(property1);
    let result = await propertyM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El tipo no debe tener más de 30 caracteres.")
    expect(errors).toContain("El código no debe tener más de 10 caracteres.")
    expect(errors).toContain("El tipo de operación no debe tener más de 10 caracteres.")
    expect(errors).toContain("El nombre no debe tener más de 30 caracteres.")
    expect(errors).toContain("La descripción no debe tener más de 255 caracteres.")
    expect(errors).toContain("La ciudad no debe tener más de 15 caracteres.")
    expect(errors).toContain("La superficie no debe ser superior a 10000000.")
    expect(errors).toContain("El precio no debe ser superior a 10000000.")
    expect(errors).toContain("La dirección no debe tener más de 50 caracteres.")
    expect(errors).toContain("El piso no debe ser superior a 10000.")
    expect(errors).toContain("El número de habitaciones no debe ser superior a 100.")
    expect(errors).toContain("El número de baños no debe ser superior a 100.")
    expect(errors).toContain("El precio de comunidad no debe ser superior a 10000.")
});

test('MODELO PROPERTY / LOCAL, POS - Tamaños Máximos', async () => {
    let owner = {
        name: "Propietario 1",
        surname: "Apellido Propietario 1",
        dni: "00000000A",
        phone: 666666666,
        email: "propietario1@propietario.com",
        address: "Direccion Propietario 1",
    }
    let ownerM = new ownerModel(owner);
    await ownerM.save();
    let ownerId = ownerM._id;

    let property1 = {
        type: longString(),
        code: longString(),
        typeOp: longString(),
        name: longString(),
        address: longString(),
        floor: longNumber(),
        description: longString(),
        city: longString(),
        area: longNumber(),
        numAseos: longNumber(),
        price: longNumber(),
        priceCom: longNumber(),
        escaparate: true,
        aparcamiento: false,
        cargaYdescarga: true,
        extintores: false,
        iluminacion: true,
        calefaccion: false,
        aireAcon: true,
        media: [],
        owner: mongoose.mongo.ObjectID(ownerId)
    }
    let propertyM = new propertyModel(property1);
    let result = await propertyM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El tipo no debe tener más de 30 caracteres.")
    expect(errors).toContain("El código no debe tener más de 10 caracteres.")
    expect(errors).toContain("El tipo de operación no debe tener más de 10 caracteres.")
    expect(errors).toContain("El nombre no debe tener más de 30 caracteres.")
    expect(errors).toContain("La descripción no debe tener más de 255 caracteres.")
    expect(errors).toContain("La ciudad no debe tener más de 15 caracteres.")
    expect(errors).toContain("La superficie no debe ser superior a 10000000.")
    expect(errors).toContain("El precio no debe ser superior a 10000000.")
    expect(errors).toContain("La dirección no debe tener más de 50 caracteres.")
    expect(errors).toContain("El piso no debe ser superior a 10000.")
    expect(errors).toContain("El número de aseos no debe ser superior a 4.")
    expect(errors).toContain("El precio de comunidad no debe ser superior a 10000.")
});

test('MODELO PROPERTY / SUELO, POS - Tamaños Máximos', async () => {
    let owner = {
        name: "Propietario 1",
        surname: "Apellido Propietario 1",
        dni: "00000000A",
        phone: 666666666,
        email: "propietario1@propietario.com",
        address: "Direccion Propietario 1",
    }
    let ownerM = new ownerModel(owner);
    await ownerM.save();
    let ownerId = ownerM._id;

    let property1 = {
        type: longString(),
        code: longString(),
        typeOp: longString(),
        name: longString(),
        description: longString(),
        city: longString(),
        situation: longString(),
        area: longNumber(),
        edifArea: longNumber(),
        price: longNumber(),
        accesoAgua: true,
        accesoLuz: false,
        media: [],
        owner: mongoose.mongo.ObjectID(ownerId)
    }
    let propertyM = new propertyModel(property1);
    let result = await propertyM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El tipo no debe tener más de 30 caracteres.")
    expect(errors).toContain("El código no debe tener más de 10 caracteres.")
    expect(errors).toContain("El tipo de operación no debe tener más de 10 caracteres.")
    expect(errors).toContain("El nombre no debe tener más de 30 caracteres.")
    expect(errors).toContain("La descripción no debe tener más de 255 caracteres.")
    expect(errors).toContain("La ciudad no debe tener más de 15 caracteres.")
    expect(errors).toContain("La superficie no debe ser superior a 10000000.")
    expect(errors).toContain("El área edificable no debe ser superior a 10000000.")
    expect(errors).toContain("El precio no debe ser superior a 10000000.")
});

test('MODELO PROPERTY / VIVIENDA, POS - Tamaños Mínimos', async () => {
    let owner = {
        name: "Propietario 1",
        surname: "Apellido Propietario 1",
        dni: "00000000A",
        phone: 666666666,
        email: "propietario1@propietario.com",
        address: "Direccion Propietario 1",
    }
    let ownerM = new ownerModel(owner);
    await ownerM.save();
    let ownerId = ownerM._id;

    let property1 = {
        type: "A",
        typeOp: "A",
        name: "A",
        address: "A",
        description: "A",
        city: "A",
        area: 0,
        numHabs: 0,
        numBan: 0,
        garaje: true,
        piscina: false,
        terraza: true,
        trastero: false,
        jardin: true,
        ascensor: false,
        calefaccion: true,
        aireAcon: false,
        amueblado: true,
        animales: false,
        media: [],
        owner: mongoose.mongo.ObjectID(ownerId)
    }
    let propertyM = new propertyModel(property1);
    let result = await propertyM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El tipo no debe tener menos de 2 caracteres.")
    expect(errors).toContain("El tipo de operación no debe tener menos de 2 caracteres.")
    expect(errors).toContain("El nombre no debe tener menos de 4 caracteres.")
    expect(errors).toContain("La descripción no debe tener menos de 5 caracteres.")
    expect(errors).toContain("La ciudad no debe tener menos de 2 caracteres.")
    expect(errors).toContain("La superficie no debe ser inferior a 10.")
    expect(errors).toContain("La dirección no debe tener menos de 5 caracteres.")
    expect(errors).toContain("El número de habitaciones no debe ser inferior a 0.")
    expect(errors).toContain("El número de baños no debe ser inferior a 0.")
});

test('MODELO PROPERTY / LOCAL, POS - Tamaños Mínimos', async () => {
    let owner = {
        name: "Propietario 1",
        surname: "Apellido Propietario 1",
        dni: "00000000A",
        phone: 666666666,
        email: "propietario1@propietario.com",
        address: "Direccion Propietario 1",
    }
    let ownerM = new ownerModel(owner);
    await ownerM.save();
    let ownerId = ownerM._id;

    let property1 = {
        type: 'A',
        typeOp: 'A',
        name: 'A',
        address: 'A',
        description: 'A',
        city: 'A',
        area: 0,
        numAseos: 0,
        escaparate: true,
        aparcamiento: false,
        cargaYdescarga: true,
        extintores: false,
        iluminacion: true,
        calefaccion: false,
        aireAcon: true,
        media: [],
        owner: mongoose.mongo.ObjectID(ownerId)
    }
    let propertyM = new propertyModel(property1);
    let result = await propertyM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain("El tipo no debe tener menos de 2 caracteres.")
    expect(errors).toContain("El tipo de operación no debe tener menos de 2 caracteres.")
    expect(errors).toContain("El nombre no debe tener menos de 4 caracteres.")
    expect(errors).toContain("La descripción no debe tener menos de 5 caracteres.")
    expect(errors).toContain("La ciudad no debe tener menos de 2 caracteres.")
    expect(errors).toContain( "La superficie no debe ser inferior a 10.")
    expect(errors).toContain("La dirección no debe tener menos de 5 caracteres.")
    expect(errors).toContain("El número de aseos no debe ser inferior a 1.")
});

test('MODELO PROPERTY / SUELO, POS - Tamaños Mínimos', async () => {
    let owner = {
        name: "Propietario 1",
        surname: "Apellido Propietario 1",
        dni: "00000000A",
        phone: 666666666,
        email: "propietario1@propietario.com",
        address: "Direccion Propietario 1",
    }
    let ownerM = new ownerModel(owner);
    await ownerM.save();
    let ownerId = ownerM._id;

    let property1 = {
        type: 'A',
        code: 'A',
        typeOp: 'A',
        name: 'A',
        description: 'A',
        city: 'A',
        situation: 'A',
        area: 0,
        edifArea: 0,
        price: 0,
        accesoAgua: true,
        accesoLuz: false,
        media: [],
        owner: mongoose.mongo.ObjectID(ownerId)
    }
    let propertyM = new propertyModel(property1);
    let result = await propertyM.validateSync();
    expect(result).not.toBeUndefined();

    let errors = utilities.getErrors(result.errors);
    expect(errors).toContain('El tipo no debe tener menos de 2 caracteres.')
    expect(errors).toContain("El tipo de operación no debe tener menos de 2 caracteres.")
    expect(errors).toContain("El nombre no debe tener menos de 4 caracteres.")
    expect(errors).toContain("La descripción no debe tener menos de 5 caracteres.")
    expect(errors).toContain("La ciudad no debe tener menos de 2 caracteres.")
    expect(errors).toContain("La situación no debe tener menos de 5 caracteres.")
    expect(errors).toContain("La superficie no debe ser inferior a 10.")
});

function longString(){
    return "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
}

function longNumber(){
    return 9999999999999999999999999999999999999;
}




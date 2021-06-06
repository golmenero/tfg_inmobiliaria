let nodemailer = require('nodemailer');
let variables = require('./variables.js');
let conversationsModel = require('../database/conversationModel');

module.exports = {
    /**
     * Método para generar las queries a MongoDB.
     * Añade una propiedad y un valor a un campo si existe.
     * fieldName -> El nombre del campo.
     * value -> El valor del campo.
     * object -> El objeto que se desea eliminar.
     */
    addIfExistsSimple: function (fieldName, value, object) {
        if (value) {
            object[fieldName] = value;
            return object;
        }
        return object;
    },
    /**
     * Método para generar las queries a MongoDB.
     * Añade una propiedad y un valor a un campo si existe.
     * En este caso, edita el componente para que permita todos los campos que contengan el valor.
     * fieldName -> El nombre del campo.
     * value -> El valor del campo.
     * object -> El objeto que se desea eliminar.
     */
    addIfExists: function (fieldName, value, object) {
        if (value) {
            object[fieldName] = {
                $regex: ".*" + value + ".*",
                $options: 'i'
            };
            return object;
        }
        return object;
    },
    /**
     * Método para generar las queries a MongoDB.
     * Añade una comprobacion numérica de límite superior e inferior.
     * fieldName -> El nombre del campo.
     * valueGreater -> El valor superior del campo.
     * valueLower -> El valor inferior del campo.
     * object -> El objeto que se desea eliminar.
     */
    addIfExistsGTLT: function (fieldName, valueGreater, valueLower, object) {
        if (valueGreater && valueLower) {
            object[fieldName] = {
                $gt: parseInt(valueGreater),
                $lt: parseInt(valueLower)
            }
        }
        return object;
    },
    /**
     * Método para generar las queries a MongoDB.
     * Permite convertir los atributos de un Selector a un booleano
     * fieldName -> El nombre del campo.
     * value -> El valor del campo.
     * object -> El objeto que se desea eliminar.
     */
    addIfExistsCB: function (fieldName, value, object) {
        if (value == "on") {
            object[fieldName] = true;
        }
        return object;

    },
    /**
     * Método para generar las queries a MongoDB.
     * Permite convertir los valores seleccionados de checkbox e input a un lenguaje que pueda ser interpretado por MongoDB.
     * Comprueba que los valores sean apropiados y devuelve el valor oportuno.
     * tipoElemento -> El tipo de elemento a convertir.
     * elemento -> El elemento que se desea convertir..
     */
    parseElement: function (tipoElemento, elemento) {
        if (tipoElemento == "checkbox") {
            if (elemento == undefined)
                return false;
            else
                return true;
        }
        if (tipoElemento == "input") {
            if (elemento == undefined)
                return "";
            else
                return elemento;
        }
    },
    /**
     * Permite construir el propietario en función del cuerpo
     * req -> El objeto request del cual se puede sacar el cuerpo.
     */
    buildOwner: function (req) {
        let owner = {
            name: this.parseElement("input", req.body.nameOwner),
            surname: this.parseElement("input", req.body.surnameOwner),
            dni: this.parseElement("input", req.body.dniOwner),
            phone: this.parseElement("input", req.body.phoneOwner),
            email: this.parseElement("input", req.body.emailOwner),
            address: this.parseElement("input", req.body.addressOwner)
        }
        return owner;
    },
    /**
     * Permite construir la propiedad en función del cuerpo
     * req -> El objeto request del cual se puede sacar el cuerpo.
     */
    buildProperty: function (req) {
        let prop = null;
        let propertyType = req.body.type;
        if (propertyType == "vivienda") {
            prop = {
                type: this.parseElement("input", propertyType),
                code: this.parseElement('input', req.body.code),
                typeOp: this.parseElement('input', req.body.typeOp),
                name: this.parseElement("input", req.body.name),
                address: this.parseElement("input", req.body.address),
                floor: parseInt(this.parseElement("input", req.body.floorV)),
                description: this.parseElement("input", req.body.description),
                city: this.parseElement("input", req.body.city),
                area: parseInt(this.parseElement("input", req.body.area)),
                numHabs: parseInt(this.parseElement("input", req.body.numHabs)),
                numBan: parseInt(this.parseElement("input", req.body.numBan)),
                price: parseInt(this.parseElement("input", req.body.price)),
                priceCom: parseInt(this.parseElement("input", req.body.priceCom)),
                garaje: this.parseElement("checkbox", req.body.checkGaraje),
                piscina: this.parseElement("checkbox", req.body.checkPiscina),
                terraza: this.parseElement("checkbox", req.body.checkTerraza),
                trastero: this.parseElement("checkbox", req.body.checkTrastero),
                jardin: this.parseElement("checkbox", req.body.checkJardin),
                ascensor: this.parseElement("checkbox", req.body.checkAscensor),
                calefaccion: this.parseElement("checkbox", req.body.checkCalefaccion),
                aireAcon: this.parseElement("checkbox", req.body.checkAireAcon),
                amueblado: this.parseElement("checkbox", req.body.checkAmueblado),
                animales: this.parseElement("checkbox", req.body.checkAnimales),
            }
        }
        if (propertyType == "local") {
            prop = {
                type: this.parseElement("input", propertyType),
                code: this.parseElement('input', req.body.code),
                typeOp: this.parseElement('input', req.body.typeOp),
                name: this.parseElement("input", req.body.name),
                address: this.parseElement("input", req.body.address),
                floor: parseInt(this.parseElement("input", req.body.floorV)),
                description: this.parseElement("input", req.body.description),
                city: this.parseElement("input", req.body.city),
                area: parseInt(this.parseElement("input", req.body.areaLoc)),
                numAseos: parseInt(this.parseElement("input", req.body.numAsLoc)),
                price: parseInt(this.parseElement("input", req.body.priceLoc)),
                priceCom: parseInt(this.parseElement("input", req.body.priceComLoc)),
                escaparate: this.parseElement("checkbox", req.body.checkEscaparateLoc),
                aparcamiento: this.parseElement("checkbox", req.body.checkAparcamientoLoc),
                cargaYdescarga: this.parseElement("checkbox", req.body.checkCargaYDescargaLoc),
                extintores: this.parseElement("checkbox", req.body.checkExtintoresLoc),
                iluminacion: this.parseElement("checkbox", req.body.checkIluminacionLoc),
                calefaccion: this.parseElement("checkbox", req.body.checkCalefaccionLoc),
                aireAcon: this.parseElement("checkbox", req.body.checkAireAconLoc),
            }
        }
        if (propertyType == "suelo") {
            prop = {
                type: this.parseElement("input", propertyType),
                code: this.parseElement('input', req.body.code),
                typeOp: this.parseElement('input', req.body.typeOp),
                name: this.parseElement("input", req.body.name),
                description: this.parseElement("input", req.body.description),
                city: this.parseElement("input", req.body.city),
                situation: this.parseElement("input", req.body.situationSue),
                area: parseInt(this.parseElement("input", req.body.areaSue)),
                edifArea: parseInt(this.parseElement("input", req.body.areaEdifSue)),
                price: parseInt(this.parseElement("input", req.body.priceSue)),
                accesoAgua: this.parseElement("checkbox", req.body.accesoAguaSue),
                accesoLuz: this.parseElement("checkbox", req.body.accesoLuzSue),
            }
        }
        return prop;
    },
    /**
     * Permite construir el transportador del correo electrónico.
     */
    createTransporter: function () {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: variables.EMAILVERIF,
                pass: variables.PASSVERIF,
            }
        });
        return transporter;
    },
    /**
     * Permite construir las opciones de envio de un correo electrónico.
     */
    createMailOptions: function (to, subject, content) {
        let mailOptions = {
            from: variables.EMAILVERIF,
            to: to,
            subject: subject,
            html: content
        }
        return mailOptions;
    },
    /**
     * Permite obtener la cantidad de valores que cumplen una condicion de Mes en un array.
     * array -> El array en cuestión.
     * monthI -> El mes que se desea comprobar.
     */
    sizeMonth: function (array, monthI) {
        return Object.values(array).filter(element => element.month == monthI).length;
    },
    /**
     * Permite obtener la cantidad de propiedades dato un tipo, publicados en el mes actual.
     * array -> El array en cuestión.
     * type -> El tipo de propiedad.
     */
    typeThisMonth: function (array, type) {
        return Object.values(array).filter(element => element.propertyType == type).filter(element => element.month == new Date().getMonth() + 1).length;
    },
    /**
     * Permite obtener la cantidad de propiedades dato un tipo, publicados en el año actual.
     * array -> El array en cuestión.
     * type -> El tipo de propiedad.
     */
    typeThisYear: function (array, type) {
        return Object.values(array).filter(element => element.propertyType == type).filter(element => element.year == new Date().getFullYear()).length;
    },
    /**
     * Permite cargar una serie de imágenes en un directorio con un id dado.
     * files -> El array de archivos.
     * id -> El id que será el nombre del directorio (id de la propiedad).
     * fileSystem - > El módulo que permite añadir las imágenes a los ficheros.
     */
    getArrayImg: async function (files, id, fileSystem, startCounter) {
        // Usamos el paquete fs-extra para crear el directorio
        await fileSystem.ensureDir("public/propertiesimg/" + id.toString())

        if(startCounter == 0) {
            // Vaciamos el directorio si tiene contenido
            await fileSystem.emptyDir("public/propertiesimg/" + id.toString());
        }
        let arrayImg = [];

        // Usamos el paquete express-fileupload para meter las imagenes en el directorio
        if (Array.isArray(files)) {
            for (let counter = startCounter; counter < files.length + startCounter; counter++) {
                name = 'public/propertiesimg/' + id.toString() + "/" + id.toString() + "_" + counter + '.png';
                await files[counter - startCounter].mv(name);
                arrayImg.push(name.replace("public", ""));
            }

        } else {
            name = 'public/propertiesimg/' + id + "/" + id + "_" + startCounter + '.png';
            await files.mv(name);
            arrayImg.push(name.replace("public", ""));
        }
        return arrayImg;
    },
    /**
     * Permite generar un string aleatorio de letras y números de una longitud aportada.
     * len -> La longitud aportada.
     */
    stringGen: function (len) {
        var text = "";

        var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < len; i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));

        return text;
    },
    /**
     * Permite obtener la fecha y hora actual en un formato correcto.
     */
    getDateTime: function () {
        let date = new Date();
        let hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        let min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        let sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        let year = date.getFullYear();

        let month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        let day = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
    },
    /**
     * Permite comprobar si una fecha ha expirado (si ha pasado el tiempo de permiso)
     * dateToday -> La fecha actual.
     * expirationDateUser -> La fecha que se desea comprobar.
     */
    expirated: function (dateToday, expirationDateUser) {
        let todaySecs = this.convertToInt(dateToday);
        let expSecs = this.convertToInt(expirationDateUser);

        if ((todaySecs - expSecs) > 600)
            return true;
        return false;
    },
    /**
     * Permite convertir una fecha a enteros.
     * date -> La fecha.
     */
    convertToInt: function (date) {
        let array = date.split(':');

        let integer = (parseInt(array[0]) * 31536000) + (parseInt(array[1]) * 2592000) +
            (parseInt(array[2]) * 86400) + (parseInt(array[3]) * 3600) + (parseInt(array[4]) * 60) + (parseInt(array[5]));
        return integer;
    },
    /**
     * Permite eliminar un item de un array.
     * arr -> El array.
     * value -> El item que se desea eliminar.
     */
    removeItemOnce: function (arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    },
    /**
     * Permite obtener la hora actual en un formato apropiado para mostrar en el chat.
     */
    getTimeChat: function () {
        let date = new Date();
        let hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        let min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        return hour + ":" + min;
    },
    /**
     * Permite obtener la fecha actual en un formato apropiado para mostrar en el chat.
     */
    getDateChat: function () {
        let date = new Date();
        let month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        let day = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        return day + ", " + month;
    },
    /**
     * Permite obtener las notificaciones periódicamente.
     * permission -> El permiso de aquel que se desea obtener las notificaciones.
     * id -> El id del agente o del usuario
     */
    getNotifs: async function (permission, id) {
        let condition = {
            $or: [{
                "agent": id,
            },
                {
                    "user": id,
                }]
        }

        let conversations = await conversationsModel.find(condition);
        let counter = 0;
        for (let i = 0; i < conversations.length; i++) {
            let messages = conversations[i].messages;
            let counter2 = messages.filter(msg => (!msg.seen && msg.from != permission)).length;
            counter += counter2;
        }
        return counter;
    },
    /**
     * Permite cargar los errores que se han producido en un array.
     * errors -> Los errores producidos, antes de ser convertidos..
     */
    getErrors(errors) {
        let output = [];
        for (let prop in errors) {
            output.push(errors[prop].message);
        }
        return output;
    },
    /**
     * Actualiza un objeto si es necesario.
     * oldOne -> El objeto antes de ser actualizado.
     * newOne -> El nuevo objeto (o fragmento del mismo_
     */
    updateIfNecessary(oldOne, newOne) {
        for(let p in oldOne){
            if(typeof  newOne[p] != 'undefined' && newOne[p] != null){
                oldOne[p] = newOne[p];
            }
        }
        return oldOne;
    }
}

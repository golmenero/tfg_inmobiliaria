module.exports = {
    addIfExists: function (fieldName, value, object) {
        if (value) {
            object[fieldName] = {$regex: ".*" + value + ".*"};
            return object;
        }
        return object;
    },
    addIfExistsGTLT: function (fieldName, valueGreater, valueLower, object) {
        if (valueGreater && valueLower) {
            object[fieldName] = {
                $gt: parseInt(valueGreater),
                $lt: parseInt(valueLower)
            }
        }
        return object;
    },
    addIfExistsCB: function (fieldName, value, object) {
        if (value == "on") {
            object[fieldName] = "Si";
        }
        return object;

    },
    parseElement: function (tipoElemento, elemento) {
        if (tipoElemento == "checkbox") {
            if (elemento == undefined)
                return "No";
            else
                return "Si";
        }
        if (tipoElemento == "input") {
            if (elemento == undefined)
                return "";
            else
                return elemento;
        }
    },
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
                aireAcon: this.parseElement("checkbox", req.body.checkAireAconLoc)
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
                accesoLuz: this.parseElement("checkbox", req.body.accesoLuzSue)
            }
        }
        owner = {
            nameOwner: this.parseElement("input", req.body.nameOwner),
            surnameOwner: this.parseElement("input", req.body.surnameOwner),
            dniOwner: this.parseElement("input", req.body.dniOwner),
            phoneOwner: this.parseElement("input", req.body.phoneOwner),
            emailOwner: this.parseElement("input", req.body.emailOwner),
            addressOwner: this.parseElement("input", req.body.addressOwner)
        };
        let property = {...prop, ...owner};
        return property;
    },
    // Creacion de correos
    createTransporter: function (nodemailer, variables) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: variables.EMAILVERIF,
                pass: variables.PASSVERIF,
            }
        });
        return transporter;
    },
    createMailOptions: function (to, subject, content, variables) {
        let mailOptions = {
            from: variables.EMAILVERIF,
            to: to,
            subject: subject,
            html: content
        }
        return mailOptions;
    },
    // Estadísticas
    sizeMonth: function (array, monthI) {
        return Object.values(array).filter(element => element.month == monthI).length;
    },
    typeThisMonth: function (array, type) {
        return Object.values(array).filter(element => element.propertyType == type).filter(element => element.month == new Date().getMonth() + 1).length;
    },
    typeThisYear: function (array, type) {
        return Object.values(array).filter(element => element.propertyType == type).filter(element => element.year == new Date().getFullYear()).length;
    },
    // Gestion de imágenes
    getArrayImg: async function (files, id, fileSystem) {
        // Usamos el paquete fs-extra para crear el directorio
        await fileSystem.ensureDir("public/propertiesimg/" + id)
        // Vaciamos el directorio si tiene contenido
        await fileSystem.emptyDir("public/propertiesimg/" + id);

        let arrayImg = [];

        // Usamos el paquete express-fileupload para meter las imagenes en el directorio
        if (Array.isArray(files)) {
            for (let counter = 0; counter < files.length; counter++) {
                name = 'public/propertiesimg/' + id + "/" + id + "_" + counter + '.png';
                await files[counter].mv(name);
                arrayImg.push(name.replace("public", ""));
            }

        } else {
            name = 'public/propertiesimg/' + id + "/" + id + "_0" + '.png';
            await files.mv(name);
            arrayImg.push(name.replace("public", ""));
        }
        return arrayImg;
    },
    // Usado para generar el codigo de verificacion de correo electronico.
    stringGen: function (len) {
        var text = "";

        var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < len; i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));

        return text;
    },
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
    expirated: function (dateToday, expirationDateUser) {
        let todaySecs = this.convertToInt(dateToday);
        let expSecs = this.convertToInt(expirationDateUser);

        if ((todaySecs - expSecs) > 600)
            return true;
        return false;
    },
    convertToInt: function (date) {
        let array = date.split(':');

        let integer = (parseInt(array[0]) * 31536000) + (parseInt(array[1]) * 2592000) +
            (parseInt(array[2]) * 86400) + (parseInt(array[3]) * 3600) + (parseInt(array[4]) * 60) + (parseInt(array[5]));
        return integer;
    },
    removeItemOnce: function(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
}

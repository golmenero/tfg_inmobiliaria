let userModel = require('../database/userModel');

let propertyModel = require('../database/propertyModel');
let ownerModel = require('../database/ownerModel');

module.exports = function (app, render, nodemailer, variables, utilities, fileSystem, mongoose) {

    /**
     * Peticion GET
     * Obtiene la propiedad con un ID y muestra sus detalles en pantalla.
     * :id -> El id de la propiedad a la cual se le quieren ver los detalles.
     */
    app.get('/properties/details/:id', async function (req, res) {
        let condition = {"_id": mongoose.mongo.ObjectID(req.params.id)};
        let property = await propertyModel.findOne(condition);
        let propertyFull = await propertyModel.populate(property, {path: 'owner'})

        if (propertyFull == null) {
            req.flash('error', ['Ocurrió un error al mostrar los detalles de la propiedad especificada.'])
            res.redirect('/myproperties');
        } else {
            let response = render(req.session, 'views/properties/property_details.html', {
                property: propertyFull,
                error: req.flash('error'),
                success: req.flash('success')
            });
            res.send(response);
        }
    });

    /**
     * Peticion GET
     * Obtiene la propiedad que se desea editar y muestra la pantalla de edición con ésta.
     * :id -> El id de la propiedad que se desea editar.
     */
    app.get('/properties/edit/:id', async function (req, res) {
        let condition = {"_id": mongoose.mongo.ObjectID(req.params.id)};
        let property = await propertyModel.findOne(condition);
        if (property == null) {
            req.flash('error', ['Ocurrió un error al encontrar la propiedad especificada.'])
            res.redirect('/myproperties');
        } else {
            let propertyFull = await propertyModel.populate(property, {path: 'owner'})
            let response = render(req.session, 'views/properties/property_modify.html',
                {
                    property: propertyFull,
                    error: req.flash('error'),
                    success: req.flash('success')
                });
            res.send(response);
        }
    });

    /**
     * Peticion POST
     * Procesa la propiedad editada y, si es válida, la actualiza en la Base de Datos.
     * :id -> El id de la propiedad que se desea editar.
     */
    app.post('/properties/edit/:id', async function (req, res) {
        let ownerCond = utilities.buildOwner(req);
        // Debemos buscar el usuario por todos sus parametros
        let owner = await ownerModel.findOne(ownerCond);
        let errorMsgs = [];
        let idO = null;
        // Si no encuentra el propietario lo añade
        if (owner === null) {
            let ownerAdd = new ownerModel(ownerCond);
            let error = ownerAdd.validateSync();
            if (!error) {
                let response = await ownerAdd.save();
                if (response === null) {
                    req.flash('error', ['No se ha podido añadir el propietario.'])
                    res.redirect('/properties/vivienda');
                }
                idO = {owner: mongoose.mongo.ObjectID(ownerAdd.id)};
            } else {
                errorMsgs = utilities.getErrors(error.errors);
                res.redirect('/myproperties')
            }
        } else {
            idO = {owner: mongoose.mongo.ObjectID(owner.id)};
        }

        // Creamos la propiedad y le añadimos el id del propietario
        let propertyNew = {...utilities.buildProperty(req), ...idO}
        // Añadimos las imágenes en carpeta y las asignamos a la propiedad
        let arrayImg = await utilities.getArrayImg(req.files.imginmueble, req.params.id, fileSystem);
        propertyNew = {...propertyNew, ...arrayImg}

        // Modificamos la propiedad (Lo hacemos de la forma compleja para poder validarlo)
        let condition = {"_id": mongoose.mongo.ObjectID(req.params.id)};

        let oldProperty = await propertyModel.findOne(condition);
        let oldPrice = oldProperty.price;

        let propertyM = new propertyModel(utilities.updateIfNecessary(oldProperty, propertyNew))
        let error = propertyM.validateSync();

        if (!error) {
            let result = await propertyM.save();
            // Si no la encuentra lanza un error
            if (result === null) {
                req.flash('error', ["Error al editar la propiedad."])
                res.redirect('/myproperties')
            }
            // Si la encuentra compara los precios y, si es menor, envia un correo a todos los usuarios que tengan la propiedad en seguimiento.
            else {
                if (oldPrice > propertyNew.price) {
                    let condition2 = {
                        wishes: req.params.id
                    }
                    let users = await userModel.find(condition2);
                    if (users != null) {
                        for (let i = 0; i < users.length; i++) {
                            let transporter = utilities.createTransporter(nodemailer, variables);
                            let mailOptions = utilities.createMailOptions(users[i].email,
                                'Aviso de ARCA Inmobiliaria', "<h1>Una propiedad de su lista de seguimiento ha bajado de precio.</h1>" +
                                "<p>Échale un vistazo: https://localhost:8081/properties/details/" + req.params.id + "</p>", variables);

                            await transporter.sendMail(mailOptions);
                        }
                    }
                }
                req.flash('success', ["Propiedad editada correctamente."])
                res.redirect("/myproperties");
            }
        } else {
            let errorMsgs = utilities.getErrors(error.errors);
            req.flash('error', errorMsgs)
            res.redirect("/myproperties");
        }
    });

    /**
     * Peticion GET
     * Obtiene la propiedad con un ID y la elimina de la Base de Datos.
     * :id -> El id de la propiedad que se desea eliminar
     */
    app.get('/properties/delete/:id', async function (req, res) {
        let condition = {"_id": mongoose.mongo.ObjectID(req.params.id)};
        let propiedad = await propertyModel.deleteOne();
        if (propiedad === null) {
            req.flash('error', ["Error al eliminar la propiedad."])
            res.redirect('/myproperties')
        } else {
            // Usamos el paquete fs-extra para eliminar el directorio
            fileSystem.remove('public/propertiesimg/' + req.params.id);
            // Borramos esta propiedade de los seguimientos de todos los usuarios
            let user = {$pull: {wishes: req.params.id}}
            await userModel.updateMany({}, user);
            req.flash('success', ["Propiedad eliminada correctamente."])
            res.redirect("/myproperties");
        }
    });

    /**
     * Peticion GET
     * Muestra la pantalla de añadir nueva propiedad.
     */
    app.get('/properties/add', function (req, res) {
        let response = render(req.session, 'views/properties/property_add.html', {
            error: req.flash('error'),
            success: req.flash('success')
        });
        res.send(response);
    })

    /**
     * Peticion POST
     * Obtiene los datos del formulario, construye la propiedad y la publica en la Base de Datos.
     */
    app.post('/properties/add', async function (req, res) {
        // Primero debemos tratar con el propietario
        let owner = utilities.buildOwner(req);
        let foundOwner = await ownerModel.findOne({dni: owner.dni, email: owner.email});

        let idO = null;
        if (foundOwner === null) {
            let modelOwner = new ownerModel(owner);
            let result = await modelOwner.save();
            if (result === null) {
                req.flash('error', ["No se ha podido añadir al propietario del inmueble."])
                res.redirect('/properties/vivienda')
            }
            idO = modelOwner._id;
        } else {
            idO = foundOwner._id;
        }

        // Ahora tratamos con la propiedad, añadiendole el id del propietario
        let property = utilities.buildProperty(req);
        let prop = {...property, ...{owner: idO}};

        let model = new propertyModel(prop);
        let error = model.validateSync();
        if (!error) {
            let saved = await model.save();
            // Si la propiedad no se guarda correctamente manda un error
            if (saved === null) {
                req.flash('error', ["La propiedad no se pudo añadir correctamente."])
                res.redirect('/properties/' + property.type)
            }
            // Si se guarda, utilizamos su ID para guardar las imagenes y luego editamos la propiedad añadiéndole el array.
            else {
                let arrayImg = await utilities.getArrayImg(req.files.imginmueble, mongoose.mongo.ObjectID(model._id), fileSystem);
                let condition = {"_id": mongoose.mongo.ObjectID(model._id)};
                let property = {media: arrayImg,}
                let result = await propertyModel.findOneAndUpdate(condition, property);

                if (result === null) {
                    req.flash('error', ["Error al añadir las imágenes de la propiedad."])
                    res.redirect('/properties/' + property.type)
                } else {
                    req.flash('success', ["La propiedad se añadió correctamente."])
                    res.redirect("/myproperties");
                }
            }
        } else {
            let errorMsgs = utilities.getErrors(error.errors);
            req.flash('error', errorMsgs)
            res.redirect("/properties/add");
        }
    });

    /**
     * Peticion GET
     * Muestra las propiedades en pantalla en función del tipo seleccionado.
     * :type -> El tipo deleccionado.
     */
    app.get('/properties/:type', async function (req, res) {
        if (req.params.type == undefined) {
            res.redirect("/properties/vivienda")
        }
        let condition = {type: req.params.type};
        condition = utilities.addIfExists("name", req.query.name, condition);
        condition = utilities.addIfExists("typeOp", req.query.typeOp, condition);
        if (req.params.type == 'vivienda') {
            condition = utilities.addIfExists("address", req.query.address, condition);
            condition = utilities.addIfExists("city", req.query.city, condition);
            condition = utilities.addIfExistsSimple("numHabs", parseInt(req.query.numHabs), condition);
            condition = utilities.addIfExistsSimple("numBan", parseInt(req.query.numBan), condition);
            // Superficie
            condition = utilities.addIfExistsGTLT("area", req.query.areaMin, req.query.areaMax, condition);
            // Precios
            condition = utilities.addIfExistsGTLT("price", req.query.priceMin, req.query.priceMax, condition);
            // Piso
            condition = utilities.addIfExistsGTLT("floor", req.query.floorMin, req.query.floorMax, condition);
            condition = utilities.addIfExistsCB("garaje", req.query.checkGaraje, condition);
            condition = utilities.addIfExistsCB("piscina", req.query.checkPiscina, condition);
            condition = utilities.addIfExistsCB("terraza", req.query.checkTerraza, condition);
            condition = utilities.addIfExistsCB("trastero", req.query.checkTrastero, condition);
            condition = utilities.addIfExistsCB("jardin", req.query.checkJardin, condition);
            condition = utilities.addIfExistsCB("ascensor", req.query.checkAscensor, condition);
            condition = utilities.addIfExistsCB("calefaccion", req.query.checkCalefaccion, condition);
            condition = utilities.addIfExistsCB("aireAcon", req.query.checkAireAcon, condition);
            condition = utilities.addIfExistsCB("anueblado", req.query.checkAmueblado, condition);
            condition = utilities.addIfExistsCB("animales", req.query.checkAnimales, condition);
        }
        if (req.params.type == 'local') {
            condition = utilities.addIfExists("address", req.query.addressLoc, condition);
            condition = utilities.addIfExists("city", req.query.cityLoc, condition);
            condition = utilities.addIfExistsSimple("numAseos", req.query.numAseosLoc, condition);
            // Superficie
            condition = utilities.addIfExistsGTLT("area", req.query.areaMinLoc, req.query.areaMaxLoc, condition);
            // Precios
            condition = utilities.addIfExistsGTLT("price", req.query.priceMinLoc, req.query.priceMaxLoc, condition);
            // Piso
            condition = utilities.addIfExistsGTLT("floor", req.query.floorMinLoc, req.query.floorMaxLoc, condition);

            condition = utilities.addIfExistsCB("escaparate", req.query.checkEscaparateLoc, condition);
            condition = utilities.addIfExistsCB("aparcamiento", req.query.checkAparcamientoLoc, condition);
            condition = utilities.addIfExistsCB("cargaYdescarga", req.query.checkCargaYDescargaLoc, condition);
            condition = utilities.addIfExistsCB("extintores", req.query.checkExtintoresLoc, condition);
            condition = utilities.addIfExistsCB("iluminacion", req.query.checkIluminacionLoc, condition);
            condition = utilities.addIfExistsCB("calefaccion", req.query.checkCalefaccionLoc, condition);
            condition = utilities.addIfExistsCB("aireAcon", req.query.checkAireAconLoc, condition);
        }
        if (req.params.type == 'suelo') {
            condition = utilities.addIfExists("city", req.query.citySue, condition);
            condition = utilities.addIfExists("situation", req.query.situationSue, condition);
            // Superficie
            condition = utilities.addIfExistsGTLT("area", req.query.areaMinSue, req.query.areaMaxSue, condition);
            // Superficie Edificable
            condition = utilities.addIfExistsGTLT("edifArea", req.query.areaEdifMinSue, req.query.areaEdifMaxSue, condition);
            // Precios
            condition = utilities.addIfExistsGTLT("price", req.query.priceMinSue, req.query.priceMaxSue, condition);

            condition = utilities.addIfExistsCB("accesoAgua", req.query.checkAccesoAguaSue, condition);
            condition = utilities.addIfExistsCB("accesoLuz", req.query.checkAccesoLuzSue, condition);
        }

        if (req.query.search != null)
            condition = {"name": {$regex: ".*" + req.query.search + ".*"}};

        let pg = parseInt(req.query.pg);
        if (req.query.pg == null) {
            pg = 1;
        }

        let total = await propertyModel.find(condition).countDocuments();
        let properties = await propertyModel.find(condition).skip((pg - 1) * 4).limit(4);
        if (properties == null) {
            req.flash('error', ['Ocurrió un error al encontrar las propiedades.'])
            res.redirect('/myproperties');
        } else {
            let lastPg = total / 4;
            if (total % 4 > 0) {
                lastPg = lastPg + 1;
            }
            let pages = [];
            for (let i = pg - 2; i <= pg + 2; i++) {
                if (i > 0 && i <= lastPg) {
                    pages.push(i);
                }
            }
            let response = render(req.session, 'views/properties/property_list.html',
                {
                    url: req.url.split("?pg=")[0].split("&pg=")[0],
                    typeProp: req.params.type,
                    properties: properties,
                    pages: pages,
                    actual: pg,
                    error: req.flash('error'),
                    success: req.flash('success')
                });
            res.send(response);
        }
    });

    /**
     * Peticion GET
     * Muestra las propiedades publicadas por los agentes.
     */
    app.get("/myproperties", async function (req, res) {
        // Preparamos el filtro de propiedades
        let condition = {}
        condition = utilities.addIfExists("name", req.query.name, condition);
        condition = utilities.addIfExists("code", req.query.code, condition);

        // Preparamos el filtro de propietarios
        let ownerData = {};
        ownerData = utilities.addIfExists("name", req.query.nameOwner, ownerData);
        ownerData = utilities.addIfExists("surname", req.query.surnameOwner, ownerData);
        ownerData = utilities.addIfExists("dni", req.query.dniOwner, ownerData);

        let pg = parseInt(req.query.pg);
        if (req.query.pg == null) {
            pg = 1;
        }

        // Si los datos del propietario no estan vacios (se ha rellenado algun campo del filtro) lo añadimos a la condicion
        if (Object.keys(ownerData).length != 0) {
            let ownersId = await ownerModel.find(ownerData).distinct("_id");
            for (let i = 0; i < ownersId.length; i++) {
                ownersId[i] = ownersId[i].toString();
            }
            condition.owner = {$in: ownersId};
        }

        let total = await propertyModel.find(condition).countDocuments();
        let properties = await propertyModel.find(condition).skip((pg - 1) * 4).limit(5);
        if(properties != null){
            let lastPg = total / 4;
            if (total % 4 > 0) {
                lastPg = lastPg + 1;
            }
            let pages = [];
            for (let i = pg - 2; i <= pg + 2; i++) {
                if (i > 0 && i <= lastPg) {
                    pages.push(i);
                }
            }

            let response = render(req.session, 'views/properties/property_myproperties.html',
                {
                    properties: properties,
                    error: req.flash('error'),
                    success: req.flash('success'),
                    pages: pages,
                    actual: pg,
                });
            res.send(response);
        }

    });

    /**
     * Peticion GET
     * Redirige la peticion a las viviendas.
     */
    app.get("/properties", function (req, res) {
        res.redirect('/properties/vivienda')
    });


}
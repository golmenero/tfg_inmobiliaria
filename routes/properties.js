module.exports = function (app, render, nodemailer, managerDB, variables) {

    app.get('/properties/details/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.get(condition, "properties", function (properties) {
            if (properties == null) {
                res.send("Ocurrió un error");
            } else {
                let response = render(req.session, 'views/property_details.html', {
                    property: properties[0],
                    user: req.session.user,
                    error: req.flash('error'),
                    success: req.flash('success')
                });
                res.send(response);
            }
        });
    });

    // EDITAR PROPIEDADES
    app.get('/property/edit/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.get(condition, "properties", function (properties) {
            if (properties == null) {
                req.flash('error', 'Ocurrió un error al encontrar la propiedad especificada.')
                res.redirect('/myproperties');
            } else {
                let response = render(req.session, 'views/property_modify.html',
                    {
                        property: properties[0],
                        error: req.flash('error'),
                        success: req.flash('success')
                    });
                res.send(response);
            }
        });
    });

    app.post('/property/edit/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.get(condition, "properties", function (result) {
            if (result == null) {
                req.flash('error', "Error al editar la propiedad.")
                res.redirect('/myproperties')
            } else {
                let property = result[0];
                let propertyNew = buildProperty(req);
                if (property.price > propertyNew.price) {
                    console.log("Ha bajado de precio Yeet")
                    let condition2 = {
                        wishes: req.params.id
                    }
                    managerDB.get(condition2, "users", function (result) {
                        if (result != null) {
                            for (let i = 0; i< result.length; i++) {
                                let transporter = createTransporter();
                                let mailOptions = createMailOptions(result[i].email,
                                    'Aviso de ARCA Inmobiliaria', "<h1>Una propiedad de su lista de seguimiento ha bajado de precio.</h1>" +
                                    "<p>>https://localhost:8081/properties/details/" + req.params.id + "</p>");

                                transporter.sendMail(mailOptions);
                            }
                        }
                        managerDB.edit(condition, propertyNew, "properties", function (result) {
                            if (result == null) {
                                req.flash('error', "Error al añadir la propiedad.")
                                res.redirect('/myproperties')
                            } else {
                                req.flash('success', "La propiedad se editó correctamente.")
                                res.redirect('/myproperties')
                            }
                        });
                    })
                }else{
                    managerDB.edit(condition, propertyNew, "properties", function (result) {
                        if (result == null) {
                            req.flash('error', "Error al añadir la propiedad.")
                            res.redirect('/myproperties')
                        } else {
                            req.flash('success', "La propiedad se editó correctamente.")
                            res.redirect('/myproperties')
                        }
                    });
                }
            }
        });
    })

    // ELIMINAR PROPIEDADES
    app.get('/property/delete/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.delete(condition, "properties", function (properties) {
            if (properties == null) {
                res.send(response);
            } else {
                res.redirect("/myproperties");
            }
        });
    });


    app.get('/properties/add', function (req, res) {
        let response = render(req.session, 'views/property_add.html', {
            user: req.session.user.email,
            error: req.flash('error'),
            success: req.flash('success')
        });
        res.send(response);
    })

    app.post('/properties/add', function (req, res) {
        let property = buildProperty(req);
        // Connect to DB
        managerDB.add(property, "properties", function (id) {
            if (id == null) {
                req.flash('error', "La propiedad no se pudo añadir correctamente.")
                res.redirect('/properties/' + req.session.typeProp)
            } else {
                if (req.files != null) {
                    let arrayImg = getArrayImg(req.files.imginmueble, id);
                    let condition = {"_id": managerDB.mongo.ObjectID(id)};
                    let property = {
                        media: arrayImg,
                    }
                    managerDB.edit(condition, property, "properties", function (result) {
                        if (result == null) {
                            req.flash('error', "Error al añadir las imágenes de la propiedad.")
                            res.redirect('/properties/' + req.session.typeProp)
                        } else {
                            req.flash('success', "La propiedad se añadió correctamente.")
                            res.redirect("/myproperties");
                        }
                    });
                }
            }
        })
    });


    app.get('/properties/:type', function (req, res) {
        let condition = {
            type: req.params.type,
        };
        condition = addIfExists("name", req.query.name, condition);
        condition = addIfExists("typeOp", req.query.typeOp, condition);

        if (req.params.type == 'vivienda') {
            condition = addIfExists("address", req.query.address, condition);
            condition = addIfExists("city", req.query.city, condition);
            condition = addIfExists("numHabs", parseInt(req.query.numHabs), condition);
            condition = addIfExists("numBan", parseInt(req.query.numBan), condition);
            // Superficie
            condition = addIfExistsGTLT("area", req.query.areaMin, req.query.areaMax, condition);
            // Precios
            condition = addIfExistsGTLT("price", req.query.priceMin, req.query.priceMax, condition);
            // Piso
            condition = addIfExistsGTLT("floor", req.query.floorMin, req.query.floorMax, condition);
            condition = addIfExistsCB("garaje", req.query.checkGaraje, condition);
            condition = addIfExistsCB("piscina", req.query.checkPiscina, condition);
            condition = addIfExistsCB("terraza", req.query.checkTerraza, condition);
            condition = addIfExistsCB("trastero", req.query.checkTrastero, condition);
            condition = addIfExistsCB("jardin", req.query.checkJardin, condition);
            condition = addIfExistsCB("ascensor", req.query.checkAscensor, condition);
            condition = addIfExistsCB("calefaccion", req.query.checkCalefaccion, condition);
            condition = addIfExistsCB("aireAcon", req.query.checkAireAcon, condition);
            condition = addIfExistsCB("anueblado", req.query.checkAmueblado, condition);
            condition = addIfExistsCB("animales", req.query.checkAnimales, condition);
        }
        if (req.params.type == 'local') {
            condition = addIfExists("address", req.query.addressLoc, condition);
            condition = addIfExists("city", req.query.cityLoc, condition);
            condition = addIfExists("numAseos", req.query.numAseosLoc, condition);
            // Superficie
            condition = addIfExistsGTLT("area", req.query.areaMinLoc, req.query.areaMaxLoc, condition);
            // Precios
            condition = addIfExistsGTLT("price", req.query.priceMinLoc, req.query.priceMaxLoc, condition);
            // Piso
            condition = addIfExistsGTLT("floor", req.query.floorMinLoc, req.query.floorMaxLoc, condition);

            condition = addIfExistsCB("escaparate", req.query.checkEscaparateLoc, condition);
            condition = addIfExistsCB("aparcamiento", req.query.checkAparcamientoLoc, condition);
            condition = addIfExistsCB("cargaYdescarga", req.query.checkCargaYDescargaLoc, condition);
            condition = addIfExistsCB("extintores", req.query.checkExtintoresLoc, condition);
            condition = addIfExistsCB("iluminacion", req.query.checkIluminacionLoc, condition);
            condition = addIfExistsCB("calefaccion", req.query.checkCalefaccionLoc, condition);
            condition = addIfExistsCB("aireAcon", req.query.checkAireAconLoc, condition);
        }
        if (req.params.type == 'suelo') {
            condition = addIfExists("city", req.query.citySue, condition);
            condition = addIfExists("situation", req.query.situationSue, condition);
            // Superficie
            condition = addIfExistsGTLT("area", req.query.areaMinSue, req.query.areaMaxSue, condition);
            // Superficie Edificable
            condition = addIfExistsGTLT("edifArea", req.query.areaEdifMinSue, req.query.areaEdifMaxSue, condition);
            // Precios
            condition = addIfExistsGTLT("price", req.query.priceMinSue, req.query.priceMaxSue, condition);

            condition = addIfExistsCB("accesoAgua", req.query.checkAccesoAguaSue, condition);
            condition = addIfExistsCB("accesoLuz", req.query.checkAccesoLuzSue, condition);
        }

        // Guardamos el tipo en sesion
        req.session.typeProp = req.params.type;


        if (req.query.search != null)
            condition = {"name": {$regex: ".*" + req.query.search + ".*"}};

        let pg = parseInt(req.query.pg);
        if (req.query.pg == null) {
            pg = 1;
        }

        managerDB.getPG(condition, "properties", pg, function (properties, total) {
            if (properties == null) {
                res.send("Error al listar ");
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
                let response = render(req.session, 'views/shop.html',
                    {
                        url: req.url.split("?pg=")[0].split("&pg=")[0],
                        typeProp: req.session.typeProp,
                        properties: properties,
                        pages: pages,
                        actual: pg,
                        error: req.flash('error'),
                        success: req.flash('success')
                    });
                res.send(response);
            }
        });
    });


    app.get('/home', function (req, res) {
        let response = render(req.session, 'views/index.html',
            {
                error: req.flash('error'),
                success: req.flash('success')
            });
        res.send(response);

    });

    app.get("/myproperties", function (req, res) {
        managerDB.get({}, "properties", function (properties) {
            if (properties == null) {
                res.send("Error al listar ");
            } else {
                let response = render(req.session, 'views/property_myproperties.html',
                    {
                        properties: properties,
                        user: req.session.user.email,
                        error: req.flash('error'),
                        success: req.flash('success')
                    });
                res.send(response);
            }
        });
    });

    function getArrayImg(files, id) {
        let arrayImg = [];
        if (Array.isArray(files)) {
            let counter;
            for (counter = 0; counter < files.length; counter++) {
                name = 'public/propertiesimg/' + id + "_" + counter + '.png';
                files[counter].mv(name);
                arrayImg.push(name.replace("public", ""));
            }

        } else {
            name = 'public/propertiesimg/' + id + "_0" + '.png';
            files.mv(name);
            arrayImg.push(name.replace("public", ""));
        }
        return arrayImg;
    };

    function parseElement(tipoElemento, elemento) {
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
    }

    function buildProperty(req) {
        let prop = null;
        let propertyType = req.body.type;
        if (propertyType == "vivienda") {
            prop = {
                type: parseElement("input", propertyType),
                typeOp: parseElement('input', req.body.typeOp),
                name: parseElement("input", req.body.name),
                address: parseElement("input", req.body.address),
                floor: parseInt(parseElement("input", req.body.floorV)),
                description: parseElement("input", req.body.description),
                city: parseElement("input", req.body.city),
                area: parseInt(parseElement("input", req.body.area)),
                numHabs: parseInt(parseElement("input", req.body.numHabs)),
                numBan: parseInt(parseElement("input", req.body.numBan)),
                price: parseInt(parseElement("input", req.body.price)),
                priceCom: parseInt(parseElement("input", req.body.priceCom)),
                garaje: parseElement("checkbox", req.body.checkGaraje),
                piscina: parseElement("checkbox", req.body.checkPiscina),
                terraza: parseElement("checkbox", req.body.checkTerraza),
                trastero: parseElement("checkbox", req.body.checkTrastero),
                jardin: parseElement("checkbox", req.body.checkJardin),
                ascensor: parseElement("checkbox", req.body.checkAscensor),
                calefaccion: parseElement("checkbox", req.body.checkCalefaccion),
                aireAcon: parseElement("checkbox", req.body.checkAireAcon),
                amueblado: parseElement("checkbox", req.body.checkAmueblado),
                animales: parseElement("checkbox", req.body.checkAnimales),

            }
        }
        if (propertyType == "local") {
            prop = {
                type: parseElement("input", propertyType),
                typeOp: parseElement('input', req.body.typeOp),
                name: parseElement("input", req.body.name),
                address: parseElement("input", req.body.address),
                floor: parseInt(parseElement("input", req.body.floorV)),
                description: parseElement("input", req.body.description),
                city: parseElement("input", req.body.city),
                area: parseInt(parseElement("input", req.body.areaLoc)),
                numAseos: parseInt(parseElement("input", req.body.numAsLoc)),
                price: parseInt(parseElement("input", req.body.priceLoc)),
                priceCom: parseInt(parseElement("input", req.body.priceComLoc)),
                escaparate: parseElement("checkbox", req.body.checkEscaparateLoc),
                aparcamiento: parseElement("checkbox", req.body.checkAparcamientoLoc),
                cargaYdescarga: parseElement("checkbox", req.body.checkCargaYDescargaLoc),
                extintores: parseElement("checkbox", req.body.checkExtintoresLoc),
                iluminacion: parseElement("checkbox", req.body.checkIluminacionLoc),
                calefaccion: parseElement("checkbox", req.body.checkCalefaccionLoc),
                aireAcon: parseElement("checkbox", req.body.checkAireAconLoc)
            }
        }
        if (propertyType == "suelo") {
            prop = {
                type: parseElement("input", propertyType),
                typeOp: parseElement('input', req.body.typeOp),
                name: parseElement("input", req.body.name),
                description: parseElement("input", req.body.description),
                city: parseElement("input", req.body.city),
                situation: parseElement("input", req.body.situationSue),
                area: parseInt(parseElement("input", req.body.areaSue)),
                edifArea: parseInt(parseElement("input", req.body.areaEdifSue)),
                price: parseInt(parseElement("input", req.body.priceSue)),
                accesoAgua: parseElement("checkbox", req.body.accesoAguaSue),
                accesoLuz: parseElement("checkbox", req.body.accesoLuzSue)
            }
        }
        owner = {
            nameOwner: parseElement("input", req.body.nameOwner),
            surnameOwner: parseElement("input", req.body.surnameOwner),
            dniOwner: parseElement("input", req.body.dniOwner),
            phoneOwner: parseElement("input", req.body.phoneOwner),
            emailOwner: parseElement("input", req.body.emailOwner),
            addressOwner: parseElement("input", req.body.addressOwner)
        };
        let property = {...prop, ...owner};
        return property;
    }

    function addIfExists(fieldName, value, object) {
        if (value) {
            object[fieldName] = {$regex: ".*" + value + ".*"};
            return object;
        }
        return object;
    }

    function addIfExistsGTLT(fieldName, valueGreater, valueLower, object) {
        if (valueGreater && valueLower) {
            object[fieldName] = {
                $gt: parseInt(valueGreater),
                $lt: parseInt(valueLower)
            }
        }
        return object;
    }

    function addIfExistsCB(fieldName, value, object) {
        if (value == "on") {
            object[fieldName] = "Si";
        }
        return object;

    }

    function createTransporter() {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: variables.EMAILVERIF,
                pass: variables.PASSVERIF,
            }
        });
        return transporter;
    }

    function createMailOptions(to, subject, content) {
        let mailOptions = {
            from: variables.EMAILVERIF,
            to: to,
            subject: subject,
            html: content
        }
        return mailOptions;
    }
}
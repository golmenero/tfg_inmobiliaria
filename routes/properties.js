module.exports = function (app, render, nodemailer,  variables, utilities, fileSystem) {

    app.get('/properties/details/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.get(condition, "properties", function (properties) {
            if (properties == null) {
                req.flash('error', 'Ocurrió un error al mostrar los detalles de propiedad especificada.')
                res.redirect('/myproperties');
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
    app.get('/properties/edit/:id', function (req, res) {
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

    app.post('/properties/edit/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.get(condition, "properties", function (result) {
            if (result == null) {
                req.flash('error', "Error al editar la propiedad.")
                res.redirect('/myproperties')
            } else {
                let property = result[0];
                let propertyNew = utilities.buildProperty(req);
                if (property.price > propertyNew.price) {
                    let condition2 = {
                        wishes: req.params.id
                    }
                    managerDB.get(condition2, "users", function (result) {
                        if (result != null) {
                            for (let i = 0; i< result.length; i++) {
                                let transporter = utilities.createTransporter(nodemailer,variables);
                                let mailOptions = utilities.createMailOptions(result[i].email,
                                    'Aviso de ARCA Inmobiliaria', "<h1>Una propiedad de su lista de seguimiento ha bajado de precio.</h1>" +
                                    "<p>>https://localhost:8081/properties/details/" + req.params.id + "</p>", variables);

                                transporter.sendMail(mailOptions);
                            }
                        }
                        utilities.getArrayImg(req.files.imginmueble, req.params.id, fileSystem).then(arrayImg => {
                            let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
                            propertyNew = {...propertyNew, ...{media: arrayImg,}};

                            managerDB.edit(condition, propertyNew, "properties", function (result) {
                                if (result == null) {
                                    req.flash('error', "Error al añadir la propiedad.")
                                    res.redirect('/myproperties')
                                } else {
                                    req.flash('success', "La propiedad se editó correctamente.")
                                    res.redirect('/myproperties')
                                }
                            });
                        });
                    })
                }else{
                    utilities.getArrayImg(req.files.imginmueble, req.params.id,fileSystem).then(arrayImg => {
                        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
                        propertyNew = {...propertyNew, ...{media: arrayImg,}};

                        managerDB.edit(condition, propertyNew, "properties", function (result) {
                            if (result == null) {
                                req.flash('error', "Error al añadir la propiedad.")
                                res.redirect('/myproperties')
                            } else {
                                req.flash('success', "La propiedad se editó correctamente.")
                                res.redirect('/myproperties')
                            }
                        });
                    });
                }
            }
        });
    })

    // ELIMINAR PROPIEDADES
    app.get('/properties/delete/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.delete(condition, "properties", function (properties) {
            if (properties == null) {
                req.flash('error', "Error al eliminar la propiedad.")
                res.redirect('/myproperties')
            } else {
                // Usamos el paquete fs-extra para eliminar el directorio
                fileSystem.remove('public/propertiesimg/' + req.params.id);
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
        let property = utilities.buildProperty(req);
        // Connect to DB
        managerDB.add(property, "properties", function (id) {
            if (id == null) {
                req.flash('error', "La propiedad no se pudo añadir correctamente.")
                res.redirect('/properties/' + req.session.typeProp)
            } else {
                if (req.files != null) {
                    utilities.getArrayImg(req.files.imginmueble, id, fileSystem).then(arrayImg => {
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
                    })
                }
            }
        })
    });

    app.get('/properties/:type', function (req, res) {
        let condition = {
            type: req.params.type,
        };
        condition = utilities.addIfExists("name", req.query.name, condition);
        condition = utilities.addIfExists("typeOp", req.query.typeOp, condition);

        if (req.params.type == 'vivienda') {
            condition = utilities.addIfExists("address", req.query.address, condition);
            condition = utilities.addIfExists("city", req.query.city, condition);
            condition = utilities.addIfExists("numHabs", parseInt(req.query.numHabs), condition);
            condition = utilities.addIfExists("numBan", parseInt(req.query.numBan), condition);
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
            condition = utilities.addIfExists("numAseos", req.query.numAseosLoc, condition);
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
                req.flash('error', 'Ocurrió un error al encontrar las propiedades.')
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
                let response = render(req.session, 'views/property_list.html',
                    {
                        user: req.session.user,
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

    app.get("/myproperties", function (req, res) {
        let condition = {}
        condition = utilities.addIfExists("name", req.query.name, condition);
        condition = utilities.addIfExists("code", req.query.code, condition);
        condition = utilities.addIfExists("nameOwner", req.query.nameOwner, condition);
        condition = utilities.addIfExists("surnameOwner", req.query.surnameOwner, condition);
        condition = utilities.addIfExists("dniOwner", req.query.dniOwner, condition);

        managerDB.get(condition, "properties", function (properties) {
            if (properties == null) {
                req.flash('error', 'Ocurrió un error al listar sus propiedades.')
                res.redirect('/myproperties');
            } else {
                let response = render(req.session, 'views/property_myproperties.html',
                    {
                        properties: properties,
                        user: req.session.user,
                        error: req.flash('error'),
                        success: req.flash('success')
                    });
                res.send(response);
            }
        });
    });

}
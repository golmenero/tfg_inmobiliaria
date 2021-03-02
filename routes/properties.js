module.exports = function (app, render, nodemailer, managerDB) {

    app.get("/properties/saved/delete/:id", function (req, res) {
        let condition = {
            "propertyID": managerDB.mongo.ObjectID(req.params.id),
            "userEMAIL": req.session.user.email
        };
        managerDB.delete(condition, "wishes", function (properties) {
            if (properties == null) {
                res.send(response);
            } else {
                res.redirect("/properties/saved");
            }
        });
    });

    // PROPIEDADES GUARDADAS
    app.post("/properties/save/:id", function (req, res) {
        let condition = {
            email: req.session.user.email
        };
        let user = {
            wishes: req.params.id,
        }
        managerDB.edit(condition, user, "users", function (users) {
            if (users == null) {
                res.send(response);
            } else {
                res.redirect("/properties/saved");
            }
        });
    });

    // EDITAR PROPIEDADES
    app.get('/property/edit/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.get(condition, "properties", function (properties) {
            if (properties == null) {
                res.send(response);
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
        let id = req.params.id;
        let condition = {"_id": managerDB.mongo.ObjectID(id)};
        let property = {
            name: req.body.name,
            type: req.body.type,
            price: req.body.price
        }
        managerDB.edit(condition, property, "properties", function (result) {
            if (result == null) {
                res.send("Error al modificar ");
            } else {
                editImg(req.files, id, function (result) {
                    if (result == null) {
                        res.send("Error en la modificación");
                    } else {
                        res.send("Modificado");
                    }
                });

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

    app.get("/properties/saved", function (req, res) {
        let condition = {
            "userEMAIL": req.session.user.email
        };
        managerDB.get(condition, "wishes", function (properties) {
            if (properties == null) {
                res.send(response);
            } else {
                let response = render(req.session, 'views/property_mywishes.html',
                    {
                        properties: properties,
                        error: req.flash('error'),
                        success: req.flash('success')
                    });
                res.send(response);
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
        let prop = null;
        let propertyType = req.body.type;
        if (propertyType == "vivienda") {
            prop = {
                type: parseElement("input", propertyType),
                typeOp: parseElement('input', req.body.typeOp),
                name: parseElement("input", req.body.name),
                address: parseElement("input", req.body.address),
                floor: parseElement("input", req.body.floorV),
                description: parseElement("input", req.body.description),
                city: parseElement("input", req.body.city),
                area: parseElement("input", req.body.area),
                numHabs: parseElement("input", req.body.numHabs),
                numBan: parseElement("input", req.body.numBan),
                price: parseElement("input", req.body.price),
                priceCom: parseElement("input", req.body.priceCom),
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
                floor: parseElement("input", req.body.floorV),
                description: parseElement("input", req.body.description),
                city: parseElement("input", req.body.city),
                area: parseElement("input", req.body.areaLoc),
                numAseos: parseElement("input", req.body.numAsLoc),
                price: parseElement("input", req.body.priceLoc),
                priceCom: parseElement("input", req.body.priceComLoc),
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
                area: parseElement("input", req.body.areaSue),
                edifArea: parseElement("input", req.body.areaEdifSue),
                price: parseElement("input", req.body.priceSue),
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

        let imagen = null;

        if (req.files.imginmueble != null)
            imagen = req.files.imginmueble;


         // Connect to DB
         managerDB.add(property, "properties", function (id) {
            if (id == null) {
                req.flash('error', "La propiedad no se pudo añadir correctamente.")
                res.redirect('/properties')
            } else {
                if (req.files.imginmueble != null) {
                    let imagen = req.files.imginmueble;
                    imagen.mv('public/propertiesimg/' + id + '.png', function (err) {
                        if (err) {
                            req.flash('error', "La propiedad no se pudo añadir correctamente.")
                            res.redirect("/properties");
                        } else {
                            req.flash('success', "La propiedad se añadió correctamente.")
                            res.redirect("/myproperties");
                        }
                    });
                }
                //req.flash('success', "La propiedad se añadió correctamente.")
                //res.redirect("/myproperties");
            }
        })
    });

    app.get('/properties/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.get(condition, "properties", function (properties) {
            if (properties == null) {
                res.send("Ocurrió un error");
            } else {
                let response = render(req.session, 'views/property_details.html', {
                    property: properties[0],
                    user: req.session.user.email,
                    error: req.flash('error'),
                    success: req.flash('success')
                });
                res.send(response);
            }
        });
    });

    app.get("/myproperties", function (req, res) {
        let condition = {owner: req.session.user.email};
        managerDB.get(condition, "properties", function (properties) {
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

    app.get('/properties', function (req, res) {
        let condition = {};
        if (req.query.search != null)
            condition = {"name": {$regex: ".*" + req.query.search + ".*"}};

        let pg = parseInt(req.query.pg);
        if (req.query.pg == null) {
            pg = 1;
        }

        managerDB.getPropertiesPG(condition, pg, function (properties, total) {
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

    function editImg(files, id, callback) {
        if (files && files.img != null) {
            let image = files.img;
            image.mv('public/propertiesimg/' + id + '.png', function (err) {
                if (err) {
                    callback(null); // ERROR
                } else {
                    callback(true);
                }
            });
        } else {
            callback(true);
        }
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


}
module.exports = function (app, render, nodemailer, $, managerDB) {

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
            "propertyID": managerDB.mongo.ObjectID(req.params.id),
            "userEMAIL": req.session.user.email
        };
        managerDB.add(condition, "wishes", function (wishes) {
            if (wishes == null) {
                res.send(response);
            } else {
                res.redirect("/properties/saved");
            }
        });
    });

    app.get('/properties/:type/:id', function (req, res) {
        let response = 'id: ' + req.params.id + '<br>' + 'Género: ' + req.params.type;
        res.send(response);
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
                        property: properties[0]
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
                    });
                res.send(response);
            }
        });
    });

    app.get('/properties/add', function (req, res) {
        let response = render(req.session, 'views/property_add.html', {
            user: req.session.user.email
        });
        res.send(response);
    })

    app.get('/properties/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.get(condition, "properties", function (properties) {
            if (properties == null) {
                res.send("Ocurrió un error");
            } else {
                let response = render(req.session, 'views/property_details.html', {
                    property: properties[0],
                    user: req.session.user.email
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
                        user: req.session.user.email
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
                        actual: pg
                    });
                res.send(response);
            }
        });
    });

    app.post('/properties', function (req, res) {
        let property = {
            name: req.body.name,
            type: req.body.type,
            price: parseInt(req.body.price),
            owner: req.session.user.email
        }
        // Connect to DB
        managerDB.add(property, "properties", function (id) {
            if (id == null) {
                res.send("Error al insertar ");
            } else {
                if (req.files.imginmueble != null) {
                    let imagen = req.files.imginmueble;
                    imagen.mv('public/propertiesimg/' + id + '.png', function (err) {
                        if (err) {
                            res.send("Error al subir la portada");
                        } else {
                            res.redirect("properties");
                        }
                    });
                }
            }
        })
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




}
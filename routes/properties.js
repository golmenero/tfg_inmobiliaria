module.exports = function (app, swig, managerDB) {
    app.get('/properties', function (req, res) {
        let condition = {};
        if (req.query.search != null)
            condition = {"name": {$regex: ".*" + req.query.search + ".*"}};
        managerDB.getProperties(condition, function (properties) {
            if (properties == null) {
                res.send("Error al listar ");
            } else {
                let response = swig.renderFile('views/shop.html',
                    {
                        properties: properties,
                        user: req.session.user
                    });
                res.send(response);
            }
        });
    });

    app.get("/myproperties", function(req, res) {
        let condition = { owner : req.session.user };
        managerDB.getProperties(condition, function(properties) {
            if (properties == null) {
                res.send("Error al listar ");
            } else {
                let response = swig.renderFile('views/property_myproperties.html',
                    {
                        properties : properties,
                        user: req.session.user
                    });
                res.send(response);
            }
        });
    });

    app.get('/properties/add', function (req, res) {
        let response = swig.renderFile('views/property_add.html', {
            user: req.session.user
        });
        res.send(response);
    })

    app.get('/properties/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.getProperties(condition, function (properties) {
            if (properties == null) {
                res.send("Ocurrió un error");
            } else {
                let response = swig.renderFile('views/property_details.html', {
                    property: properties[0],
                    user: req.session.user
                });
                res.send(response);
            }
        });
    });

    app.get('/properties/:type/:id', function (req, res) {
        let response = 'id: ' + req.params.id + '<br>' + 'Género: ' + req.params.type;
        res.send(response);
    });


    // EDITAR PROPIEDADES
    app.get('/property/edit/:id', function (req, res) {
        let condition = { "_id" : managerDB.mongo.ObjectID(req.params.id) };
        managerDB.getProperties(condition,function(properties){
            if ( properties == null ){
                res.send(response);
            } else {
                let response = swig.renderFile('views/property_modify.html',
                    {
                        property : properties[0]
                    });
                res.send(response);
            }
        });
    });

    app.post('/property/edit/:id', function (req, res) {
        let id = req.params.id;
        let condition = { "_id" : managerDB.mongo.ObjectID(id) };
        let property = {
            name : req.body.name,
            type : req.body.type,
            price : req.body.price
        }
        managerDB.editProperty(condition, property, function(result) {
            if (result == null) {
                res.send("Error al modificar ");
            } else {
                editImg(req.files, id, function (result) {
                    if( result == null){
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
        let condition = {"_id" : managerDB.mongo.ObjectID(req.params.id) };
        managerDB.deleteProperty(condition,function(properties){
            if ( properties == null ){
                res.send(response);
            } else {
                res.redirect("/myproperties");
            }
        });
    })


    app.post('/properties', function (req, res) {
        let property = {
            name: req.body.name,
            type: req.body.type,
            price: parseInt(req.body.price),
            owner: req.session.user
        }
        // Connect to DB
        managerDB.addProperty(property, function (id) {
            if (id == null) {
                res.send("Error al insertar ");
            } else {
                if (req.files.imginmueble != null) {
                    let imagen = req.files.imginmueble;
                    imagen.mv('public/propertiesimg/' + id + '.png', function (err) {
                        if (err) {
                            res.send("Error al subir la portada");
                        } else {
                            res.send("Agregada id:  " + id);
                        }
                    });
                }
            }
        })
    });

    function editImg(files, id, callback){
        if (files && files.img != null) {
            let image =files.img;
            image.mv('public/propertiesimg/' + id + '.png', function(err) {
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
module.exports = function (app, swig, managerDB) {
    app.get('/properties', function (req, res) {
        let condition = {};
        if (req.query.search != null)
            condition = {"name": {$regex: ".*" + req.query.search + ".*"}};
        managerDB.getProperties(condition, function (properties) {
            if (properties == null) {
                res.send("Error al listar ");
            } else {
                let respuesta = swig.renderFile('views/shop.html',
                    {
                        properties: properties
                    });
                res.send(respuesta);
            }
        });
    });

    app.get('/properties/add', function (req, res) {
        let response = swig.renderFile('views/property_add.html', {});
        res.send(response);
    })

    app.get('/properties/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.getProperties(condition, function (properties) {
            if (properties == null) {
                res.send("Ocurrió un error");
            } else {
                let response = swig.renderFile('views/property_details.html', {property: properties[0]});
                res.send(response);
            }
        });
    });

    app.get('/properties/:type/:id', function (req, res) {
        let response = 'id: ' + req.params.id + '<br>' + 'Género: ' + req.params.type;
        res.send(response);
    });

    app.post('/properties', function (req, res) {
        let property = {
            name: req.body.name,
            type: req.body.type,
            price: parseInt(req.body.price)
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
    })
}
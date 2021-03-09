module.exports = function (app, render, nodemailer, managerDB, variables) {
    app.get('/agents', function (req, res) {
        let condition = {
            permission: 'A'
        }
        condition = addIfExists("name", req.query.name, condition);
        condition = addIfExists("surname", req.query.surname, condition);
        condition = addIfExists("email", req.query.email, condition);

        managerDB.get(condition, "users", function (agents) {
            if (agents != null) {
                let respuesta = render(req.session, 'views/agent_list.html', {
                    agents: agents,
                    error: req.flash('error'),
                    success: req.flash('success')
                });
                res.send(respuesta);
            } else {
                req.flash('error', "Ocurrió un error al listar los agentes.")
                res.redirect("/properties/" + req.session.typeProp);
            }
        });
    })

    app.get('/agents/add', function (req, res) {
        let response = render(req.session, 'views/agent_add.html', {
            error: req.flash('error'),
            success: req.flash('success')
        });
        res.send(response);
    })

    app.post('/agents/add', function (req, res) {
        let agent = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            permission: 'A',
            password: app.get("crypto").createHmac('sha256', app.get('key')).update(req.body.password).digest('hex'),
            active: true
        }
        // Connect to DB
        managerDB.add(agent, "users", function (id) {
            if (id == null) {
                req.flash('error', "El agente no se pudo añadir correctamente.")
                res.redirect('/agents');
            } else {
                req.flash('success', "El agente se añadió correctamente.")
                res.redirect('/agents');
            }
        })
    });

    app.get('/agents/edit/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.get(condition, "users", function (agents) {
            if (agents == null) {
                req.flash('error', "El agente no se pudo editar correctamente.")
                res.redirect('/agents');
            } else {
                let response = render(req.session, 'views/agent_modify.html', {
                    agent: agents[0],
                    error: req.flash('error'),
                    success: req.flash('success')
                });
                res.send(response);
            }
        })
    })

    app.post('/agents/edit/:id', function (req, res) {
        let agent = {}
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        (req.body.name != "") ? agent["name"] = req.body.name : agent;
        (req.body.surname != "") ? agent["surname"] = req.body.surname : agent;
        (req.body.email != "") ? agent["email"] = req.body.email : agent;
        (req.body.password != "") ? agent["password"] = app.get("crypto").createHmac('sha256', app.get('key')).update(req.body.password).digest('hex') : agent;

        // Connect to DB
        managerDB.edit(condition, agent, "users", function (id) {
            if (id == null) {
                req.flash('error', "El agente no se pudo editar correctamente.")
                res.redirect('/agents');
            } else {
                req.flash('success', "El agente se editó correctamente.")
                res.redirect('/agents');
            }
        })
    });

    app.get('/agents/delete/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};

        // Limpiamos la BBDD
        managerDB.delete(condition, "users", function (users) {
            if (users == null) {
                req.flash('error', "No se pudo eliminar el usuario.");
                res.redirect("/agents");
            } else {
                req.flash('success', "Usuario eliminado correctamente.");
                res.redirect("/agents");
            }
        });
    });

    function addIfExists(fieldName, value, object) {
        if (value) {
            object[fieldName] = {$regex: ".*" + value + ".*"};
            return object;
        }
        return object;
    }
}
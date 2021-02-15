module.exports = function (app, render, managerDB) {
    // EDITAR CONTRASEÑA USUARIOS
    app.get('/user/edit/:id', function (req, res) {
        let condition = { "_id" : managerDB.mongo.ObjectID(req.params.id) };
        managerDB.get(condition, "users", function(users){
            if ( users == null ){
                res.send(response);
            } else {
                let response = render(req.session,'views/user_modifyPassword.html',
                    {
                        user : users[0]
                    });
                res.send(response);
            }
        });
    });

    app.post('/user/edit/:id', function (req, res) {
        if(req.body.password == req.body.passwordR) {
            let seguro = app.get("crypto").createHmac('sha256', app.get('key')).update(req.body.password).digest('hex');
            let id = req.params.id;
            let condition = {"_id": managerDB.mongo.ObjectID(id)};
            let user = {
                password: seguro
            }
            managerDB.edit(condition, user, "users", function (result) {
                if (result == null) {
                    res.send("Error al modificar ");
                } else {
                    res.redirect("/properties");
                }
            });
        }
        else {
            let response = render(req.session, 'views/error_view.html',
                {
                    mensaje: "Las contraseñas no coinciden."
                });
            res.send(response);
        }
    })

    app.get("/routes", function (req, res) {
        res.send("ver usuarios");
    });

    app.get("/signin", function (req, res) {
        let respuesta = render(req.session,'views/user_signin.html', {
            user: req.session.user
        });
        res.send(respuesta);
    });

    app.post('/user', function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('key')).update(req.body.password).digest('hex');
        let user = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            permission: req.body.permission,
            password: seguro,
        };
        managerDB.add(user, "users", function (id) {
            if (id == null) {
                res.send("Error al insertar el usuario");
            } else {
                req.session.user = user + {"_id" : id};
            }
        });
    });

    app.get("/login", function(req, res) {
        let response = render(req.session,'views/user_login.html', {
            user: req.session.user
        });
        res.send(response);
    });

    app.post("/login", function(req, res) {
        let decrypted = app.get("crypto").createHmac('sha256', app.get('key'))
            .update(req.body.password).digest('hex');
        let condition = {
            email : req.body.email,
            password : decrypted
        }
        managerDB.get(condition, "users", function(users) {
            if (users == null || users.length == 0) {
                req.session.user = null;
                res.redirect("/login");
            } else {
                req.session.user = users[0];
                res.redirect('/properties');
            }
        });
    });

    app.get('/disconnect', function (req, res) {
        req.session.user = null;
        res.redirect('/properties');
    })

};

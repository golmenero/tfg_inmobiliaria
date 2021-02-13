module.exports = function (app, swig, managerDB) {
    app.get("/routes", function (req, res) {
        res.send("ver usuarios");
    });

    app.get("/signin", function (req, res) {
        let respuesta = swig.renderFile('views/user_signin.html', {
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
            password: seguro
        };
        managerDB.addUser(user, function (id) {
            if (id == null) {
                res.send("Error al insertar el usuario");
            } else {
                res.send('Usuario Insertado ' + id);
            }
        });
    });

    app.get("/login", function(req, res) {
        let response = swig.renderFile('views/user_login.html', {
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
        managerDB.getUsers(condition, function(users) {
            if (users == null || users.length == 0) {
                req.session.user = null;
                res.redirect("/login");
            } else {
                req.session.user = users[0].email;
                res.redirect('/properties');
            }
        });
    });

    app.get('/disconnect', function (req, res) {
        req.session.user = null;
        res.send("Usuario desconectado");
    })


};
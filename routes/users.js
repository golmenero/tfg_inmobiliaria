module.exports = function (app, render, nodemailer, $, managerDB) {
    // EDITAR CONTRASEÑA USUARIOS
    app.get('/user/edit/:id', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
        managerDB.get(condition, "users", function (users) {
            if (users == null) {
                res.send(response);
            } else {
                let response = render(req.session, 'views/user_modify.html',
                    {
                        user: users[0]
                    });
                res.send(response);
            }
        });
    });

    app.post('/user/edit/:id', function (req, res) {
            let user = {};
            user = (req.body.name != "") ? user + {name: req.body.name} : user;
            user = (req.body.surname != "") ? user + {name: req.body.surname} : user;
            if (req.body.password == req.body.passwordR) {
                if (req.body.password != "") {
                    // Las contraseñas son iguales y el campo no esta vacio -> añadimos el campo al user
                    let seguro = app.get("crypto").createHmac('sha256', app.get('key')).update(req.body.password).digest('hex');
                    user = user + {password: seguro};
                }
                let id = req.params.id;
                let condition = {"_id": managerDB.mongo.ObjectID(id)};
                managerDB.edit(condition, user, "users", function (result) {
                    if (result == null) {
                        res.send("Error al modificar ");
                    } else {
                        res.redirect("/properties");
                    }
                });
            } else {
                res.redirect("/user/edit/" + req.params.id);
            }
        }
    )

    app.get("/user/verification/:code", function (req, res) {
        let condition = {
            activationCode: req.params.code
        }
        let user = {
            "active": true,
        }
        managerDB.edit(condition, user, "users", function (result) {
            if (result == null) {
                res.send("Error al modificar ");
            } else {
                res.redirect("/login");
            }
        });
    });

    app.get('/user/delete', function (req, res) {
        let response = render(req.session, 'views/user_delete.html',{});
        res.send(response);
    });

    app.post("/user/delete", function (req, res) {
        let encrypted = app.get("crypto").createHmac('sha256', app.get('key'))
            .update(req.body.password).digest('hex');

        let condition = {"_id": managerDB.mongo.ObjectID(req.session.user._id)};

        if (encrypted == req.session.user.password) {
            // Limpiamos la BBDD
            managerDB.delete(condition, "users", function (users) {
                if (users == null) {
                    let response = render(req.session, 'views/error_view.html',
                        {
                            mensaje: "No se pudo eliminar el usuario."
                        });
                    res.send(response);
                } else {
                    req.session.user = null;
                    res.redirect("/login");
                }
            });
        } else {
            let response = render(req.session, 'views/error_view.html',
                {
                    mensaje: "Las contraseñas no coinciden."
                });
            res.send(response);
        }
    });

    app.get("/routes", function (req, res) {
        res.send("ver usuarios");
    });

    app.get("/signin", function (req, res) {
        let respuesta = render(req.session, 'views/user_signin.html', {
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
            active: false,
            activationCode: stringGen(20),
        };

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tfguo257386@gmail.com',
                pass: 'TFG_UO257386'
            }
        });
        let mailOptions = {
            from: 'tfguo257386@gmail.com',
            to: user.email,
            subject: 'Prueba',
            html: "<h1>Gracias por registrarse en nuestra aplicación</h1>" +
                "<h2>Verifique su correo electrónico haciendo click en el siguiente enlace:</h2>" +
                "<p>https://localhost:8081/user/verification/" + user.activationCode + "</p>"
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                let response = render(req.session, 'views/error_view.html',
                    {
                        mensaje: "Ocurrió un error inesperado al enviar el correo de verificación."
                    });
                res.send(response);
            } else {
                managerDB.add(user, "users", function (id) {
                    if (id == null) {
                        res.send("Error al insertar el usuario");
                    } else {
                        res.redirect("/login");
                    }
                });
            }
        })
    });

    app.get("/login", function (req, res) {
        let response = render(req.session, 'views/user_login.html', {
            user: req.session.user
        });
        res.send(response);
    });

    app.post("/login", function (req, res) {
        let decrypted = app.get("crypto").createHmac('sha256', app.get('key'))
            .update(req.body.password).digest('hex');

        let condition = {
            email: req.body.email,
            password: decrypted
        }
        managerDB.get(condition, "users", function (users) {
            if (users == null || users.length == 0) {
                req.session.user = null;
                res.redirect("/login");
            } else {
                let userTryingToLog = users[0];
                if (userTryingToLog.active == true) {
                    req.session.user = users[0];
                    res.redirect('/properties');
                } else {
                    let response = render(req.session, 'views/error_view.html',
                        {
                            mensaje: "Su correo no ha sido verificado. Revise su bandeja de entrada."
                        });
                    res.send(response);
                }
            }
        });
    });

    app.get('/disconnect', function (req, res) {
        req.session.user = null;
        res.redirect('/properties');
    })


// Obtener una combinacion aleatoria de letras y numeros.
// Usado para generar el codigo de verificacion de correo electronico.
    function stringGen(len) {
        var text = "";

        var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < len; i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));

        return text;
    }
};



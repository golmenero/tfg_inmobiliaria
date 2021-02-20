module.exports = function (app, render, nodemailer, managerDB) {
    app.get("/user/verification/:code", function (req, res) {
        let condition = {
            'codes.emailActivation': req.params.code
        }

        console.log(condition)

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

    app.get("/recover/:code", function (req, res) {
        let respuesta = render(req.session, 'views/user_passwordRecover.html', {
            passwordRecover: req.params.code
        });
        res.send(respuesta);
    });

    app.post("/recover/:code", function (req, res) {
        let code = req.params.code;
        let password = req.body.password;
        let passwordR = req.body.passwordR;

        if (password != passwordR) {
            let response = render(req.session, 'views/error_view.html',
                {
                    mensaje: "Las contraseñas no coinciden."
                });
            res.send(response);
        } else {
            let condition = {
                "codes.passwordRecover": code
            }

            let seguro = app.get("crypto").createHmac('sha256', app.get('key')).update(password).digest('hex');
            let user = {
                password: seguro
            }
            managerDB.edit(condition, user, "users", function (result) {
                if (result == null) {
                    res.send("Error al modificar ");
                } else {
                    res.redirect("/login");
                }
            });
        }
    });

    // EDITAR CONTRASEÑA USUARIOS
    app.get('/user/edit', function (req, res) {
        let condition = {"_id": managerDB.mongo.ObjectID(req.session.user._id)};
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

    app.post('/user/edit', function (req, res) {
        let user = {};
        (req.body.name != "") ? user["name"] = req.body.name : user;
        (req.body.surname != "") ? user["surname"] = req.body.surname : user;
        if (req.body.password == req.body.passwordR) {
            if (req.body.password != "") {
                // Las contraseñas son iguales y el campo no esta vacio -> añadimos el campo al user
                let seguro = app.get("crypto").createHmac('sha256', app.get('key')).update(req.body.password).digest('hex');
                user["password"] = seguro;
            }
            let id = req.session.user._id;
            let condition = {"_id": managerDB.mongo.ObjectID(id)};

            managerDB.edit(condition, user, "users", function (result) {
                if (result == null) {
                    res.send("Error al modificar ");
                } else {
                    res.redirect("/properties");
                }
            });
        } else {
            res.redirect("/user/edit");
        }
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
        let condition1 = {
            email: req.body.email,
        }
        // Intentamos obtener el usuario por el email
        managerDB.get(condition1, "users", function (users) {
            // Si no existe ningun usuario
            if (users == null || users.length == 0) {
                let user = {
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    permission: req.body.permission,
                    password: seguro,
                    active: false,
                    codes: {
                        emailActivation: stringGen(20),
                        passwordRecover: stringGen(20)
                    },
                };

                console.log(user)
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
                        "<p>https://localhost:8081/user/verification/" + user.codes.emailActivation + "</p>"
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
                // Si ya existe un usuario.
            } else {
                let response = render(req.session, 'views/error_view.html',
                    {
                        mensaje: "Este correo electrónico ya pertenece a una cuenta. Intente usar uno diferente."
                    });
                res.send(response);
            }

        });
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
        res.redirect('/login');
    })


    app.post('/recover', function (req, res) {
        let condition = {
            email: req.body.correoRecuperacion
        }

        managerDB.get(condition, "users", function (users) {
            if (users == null) {
                let response = render(req.session, 'views/error_view.html',
                    {
                        mensaje: "No se encontró ningún usuario. Lo sentimos"
                    });
                res.send(response);
            } else {
                let userFound = users[0];
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'tfguo257386@gmail.com',
                        pass: 'TFG_UO257386'
                    }
                });
                let mailOptions = {
                    from: 'tfguo257386@gmail.com',
                    to: req.body.correoRecuperacion,
                    subject: 'Reestablezca su Contraseña',
                    html: "<h1>Haga click en el siguiente enlace para reestablecer su contraseña.</h1>" +
                        "<p>https://localhost:8081/recover/" + userFound.codes.passwordRecover + "</p>"
                }

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        let response = render(req.session, 'views/error_view.html',
                            {
                                mensaje: "Ocurrió un error inesperado al enviar el correo de recuperación de contraseña."
                            });
                        res.send(response);
                    } else {
                        res.redirect("/login");
                    }
                })
            }
        });
    });


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



module.exports = function (app, render, managerDB, variables, utilities) {
    app.get('/home', function (req, res) {
        let response = render(req.session, 'views/index.html',
            {
                error: req.flash('error'),
                success: req.flash('success')
            });
        res.send(response);

    });

    app.get("/info/contact", function (req, res) {
        let condition = {active: true};
        managerDB.get(condition, "info", function (infos) {
            let info = {}
            if (infos != null) {
                info = infos[0]
            }
            let respuesta = render(req.session, 'views/info_contact.html', {
                info: info,
                user: req.session.user,
                error: req.flash('error'),
                success: req.flash('success')
            });
            res.send(respuesta);
        })
    });

    app.post("/info/contact/edit", function (req, res) {
        let condition = {active: true};
        let info = {active: true};
        (req.body.phones != "") ? info["phones"] = req.body.phones : info;
        (req.body.emails != "") ? info["emails"] = req.body.emails : info;

        // Connect to DB
        managerDB.edit(condition, info, "info", function (id) {
            if (id == null) {
                managerDB.add(info, "info", function (id) {
                    if (id == null) {
                        req.flash('error', "La información no se pudo editar correctamente.")
                        res.redirect('/info/contact');
                    } else {
                        req.flash('success', "La información se editó correctamente.")
                        res.redirect('/info/contact');
                    }
                })
            } else {
                req.flash('success', "La información se editó correctamente.")
                res.redirect('/info/contact');
            }
        })
    });

    app.get("/info/statistics", function (req, res) {
        let condition = {
            type: 'wish'
        }
        managerDB.get(condition, "logger", function (result) {
            let array = [utilities.sizeMonth(result, 1), utilities.sizeMonth(result, 2), utilities.sizeMonth(result, 3), utilities.sizeMonth(result, 4),
                utilities.sizeMonth(result, 5), utilities.sizeMonth(result, 6), utilities.sizeMonth(result, 7), utilities.sizeMonth(result, 8),
                utilities.sizeMonth(result, 9), utilities.sizeMonth(result, 10), utilities.sizeMonth(result, 11), utilities.sizeMonth(result, 12)];

            let arrayType = [utilities.typeThisMonth(result, 'vivienda'), utilities.typeThisMonth(result, 'local'), utilities.typeThisMonth(result, 'suelo')];

            let arrayTypeYear = [utilities.typeThisYear(result, 'vivienda'), utilities.typeThisYear(result, 'local'), utilities.typeThisYear(result, 'suelo')];


            let respuesta = render(req.session, 'views/info_statistics.html', {
                arrayTypeYear: arrayTypeYear,
                arrayType: arrayType,
                arrayWishes: array,
                user: req.session.user,
                error: req.flash('error'),
                success: req.flash('success')
            });
            res.send(respuesta);
        });
    });

    app.get("/signin", function (req, res) {
        let respuesta = render(req.session, 'views/user_signin.html', {
            user: req.session.user,
            error: req.flash('error'),
            success: req.flash('success')
        });
        res.send(respuesta);
    });

    app.post('/signin', function (req, res) {
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
                    permission: 'U',
                    password: seguro,
                    active: false,
                    codes: {
                        emailActivation: utilities.stringGen(20),
                        passwordRecover: "",
                    },
                    wishes: []
                };

                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: variables.EMAILVERIF,
                        pass: variables.PASSVERIF,
                    }
                });
                let mailOptions = {
                    from: variables.EMAILVERIF,
                    to: user.email,
                    subject: 'Verifique su correo electrónico.',
                    html: "<h1>Gracias por registrarse en nuestra aplicación</h1>" +
                        "<h2>Verifique su correo electrónico haciendo click en el siguiente enlace:</h2>" +
                        "<p>https://localhost:8081/user/verification/" + user.codes.emailActivation + "</p>"
                }

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        req.flash('error', "Ocurrió un error inesperado al enviar el correo de verificación.")
                        res.redirect("/login");
                    } else {
                        managerDB.add(user, "users", function (id) {
                            if (id == null) {
                                req.flash('error', "Ocurrió un error inesperado al añadir su usuario al sistema.")
                            } else {
                                req.flash('success', "Se ha enviado un mensaje a su bandeja de entrada. Revísela para activar su perfil.")
                                res.redirect("/login");
                            }
                        });
                    }
                })
                // Si ya existe un usuario.
            } else {
                req.flash('error', "Este correo electrónico ya pertenece a una cuenta. Intente usar uno diferente.")
                res.redirect("/signin");
            }

        });
    });

    app.get("/login", function (req, res) {
        let response = render(req.session, 'views/user_login.html', {
            user: req.session.user,
            error: req.flash("error"),
            success: req.flash("success")
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
                req.flash('error', "Usuario y/o contraseña incorrectos")
                req.session.user = null;
                res.redirect("/login");
            } else {
                let userTryingToLog = users[0];
                if (userTryingToLog.active == true) {
                    req.session.user = users[0];
                    req.flash('success', "Ha iniciado sesión correctamente.")
                    if (req.session.typeProp != undefined) {
                        res.redirect('/properties/' + req.session.typeProp)
                    } else {
                        res.redirect('/home');
                    }
                } else {
                    req.flash('error', "Su correo no ha sido verificado. Revise su bandeja de entrada.")
                    res.redirect("/login");
                }
            }
        });
    });
}


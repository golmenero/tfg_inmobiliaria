module.exports = function (app, render, nodemailer, managerDB, variables, utilities) {
    app.get("/user/verification/:code", function (req, res) {
        let condition = {
            'codes.emailActivation': req.params.code
        }

        let user = {
            "active": true,
        }
        managerDB.edit(condition, user, "users", function (result) {
            if (result == null) {
                req.flash('error', "Su correo no se ha podido verificar correctamente.")
            } else {
                req.flash('success', "Su correo electrónico se ha verificado correctamente.")
            }
            res.redirect("/login");
        });
    });

    app.get("/recover/:code", function (req, res) {
        let dateToday = utilities.getDateTime();
        let condition = {
            'codes.passwordRecover': req.params.code,
        }

        managerDB.get(condition, "users", function (users) {
            if (users == null || users.length == 0) {
                req.flash('error', "No se encontro ninguna cuenta con esta información. Vuelva a intentarlo.");
                res.redirect('/login');
            } else {
                if (users[0].permission == 'S' || users[0].permission == 'A') {
                    req.flash('error', "Un agente no puede modificar su contraseña. Póngase en contacto con su administrador.");
                    res.redirect('/login');
                } else {
                    let userRecover = users[0];
                    let expirationDateUser = userRecover.codes.passwordRecoverDate;
                    if (utilities.expirated(dateToday, expirationDateUser)) {
                        req.flash('error', "Su enlace de recuperación de contraseña ha caducado.");
                        res.redirect('/login');
                    } else {
                        let respuesta = render(req.session, 'views/user_passwordRecover.html', {
                            passwordRecover: req.params.code,
                            error: req.flash('error'),
                            success: req.flash('success')
                        });
                        res.send(respuesta);
                    }
                }
            }
        });

    });

    app.post("/recover/:code", function (req, res) {
        let code = req.params.code;
        let password = req.body.password;
        let passwordR = req.body.passwordR;

        if (password != passwordR) {
            req.flash('error', "Las contraseñas no coinciden.");
            res.redirect('/recover/' + code);
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
                    req.flash('error', "Ocurrio un error al modificar su contraseña.");
                    res.redirect('/recover/code/' + code);
                } else {
                    req.flash('success', 'Contraseña actualizada correctamente.');
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
                        user: users[0],
                        error: req.flash('error'),
                        success: req.flash('success')
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
                    req.flash('error', "Ocurrió un error al modificar su perfil.");
                } else {
                    req.flash('success', "Su perfil se ha modificado correctamente.");
                }
                res.redirect("/properties/" + req.session.typeProp);
            });
        } else {
            req.flash('error', "Las contraseñas no coinciden.");
            res.redirect("/user/edit");
        }
    });

    app.post("/user/delete", function (req, res) {
        if (req.session.user.permission != 'S') {
            let encrypted = app.get("crypto").createHmac('sha256', app.get('key'))
                .update(req.body.password).digest('hex');

            let condition = {"_id": managerDB.mongo.ObjectID(req.session.user._id)};

            if (encrypted == req.session.user.password) {
                // Limpiamos la BBDD
                managerDB.delete(condition, "users", function (users) {
                    if (users == null) {
                        req.flash('error', "No se pudo eliminar el usuario.");
                        res.redirect("/properties/" + req.session.typeProp);
                    } else {
                        req.session.user = null;
                        req.flash('success', "Usuario eliminado correctamente.");
                        res.redirect("/login");
                    }
                });
            } else {
                req.flash('error', "Contraseña incorrecta.");
                res.redirect("/properties/" + req.session.typeProp);
            }
        }
    });

    app.get('/disconnect', function (req, res) {
        req.session.user = null;
        res.redirect('/login');
    })

    app.post('/recover', function (req, res) {
        let condition = {
            email: req.body.correoRecuperacion
        }
        let user = {
            'codes.passwordRecover':utilities.stringGen(20),
            'codes.passwordRecoverDate': utilities.getDateTime(),
        }
        managerDB.edit(condition, user, "users", function (result) {
            if (result == null) {
                req.flash('error', "No se encontró ningún usuario con ese correo electrónico.");
                res.redirect("/login");
            } else {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: variables.EMAILVERIF,
                        pass: variables.PASSVERIF,
                    }
                });
                let mailOptions = {
                    from: variables.EMAILVERIF,
                    to: req.body.correoRecuperacion,
                    subject: 'Reestablezca su Contraseña',
                    html: "<h1>Haga click en el siguiente enlace para reestablecer su contraseña.</h1>" +
                        "<p>https://localhost:8081/recover/" + user["codes.passwordRecover"] + "</p>"
                }

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        req.flash('error', "Ocurrió un error al enviar su correo de reestablecimiento de contraseña.");
                        res.redirect("/login");
                    } else {
                        req.flash('success', "Se ha enviado un mensaje a su correo con instrucciones para reestablecer su contraseña.");
                        res.redirect("/login");
                    }
                })
            }
        });
    });
}
;



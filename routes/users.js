module.exports = function (app, render, nodemailer, managerDB) {
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
        let dateToday = getDateTime();
        let condition = {
            'codes.passwordRecover' : req.params.code,
        }

        managerDB.get(condition, "users", function (users) {
            if (users == null || users.length == 0) {
                req.flash('error', "No se encontro ninguna cuenta cone sta información. Vuelva a intentarlo.");
                res.redirect('/login');
            } else {
                let userRecover = users[0];
                let expirationDateUser = userRecover.codes.passwordRecoverDate;
                if (expirated(dateToday,expirationDateUser)) {
                    req.flash('error', "Su enlace de recuperación de contraseña ha caducado.");
                    res.redirect('/login');
                } else {
                    let respuesta = render(req.session, 'views/user_passwordRecover.html', {
                        passwordRecover: req.params.code,
                        error : req.flash('error'),
                        success : req.flash('success')
                    });
                    res.send(respuesta);
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
            res.redirect('/recover/code/' + code);
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
                        error : req.flash('error'),
                        success : req.flash('success')
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
                    res.redirect("/properties");
                }
            });
        } else {
            res.redirect("/user/edit");
        }
    });

    app.post("/user/delete", function (req, res) {

        let condition1 = {
            permission: "A",
        }
        managerDB.get(condition1, "users", function (users) {
            if (users.length <= 1) {
                let response = render(req.session, 'views/error_view.html',
                    {
                        mensaje: "Su perfil es el único perfil de tipo Agente. Si desea eliminar este perfil, cree otro del mismo tipo."
                    });
                res.send(response);
            } else {
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
            }
        });
    });

    app.get("/routes", function (req, res) {
        res.send("ver usuarios");
    });

    app.get("/signin", function (req, res) {
        let respuesta = render(req.session, 'views/user_signin.html', {
            user: req.session.user,
            error : req.flash('error'),
            success : req.flash('success')
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
                        passwordRecover: "",
                    },
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
                    res.redirect('/properties');
                } else {
                    req.flash('error', "Su correo no ha sido verificado. Revise su bandeja de entrada.")
                    res.redirect("/login");
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
        let user = {
            'codes.passwordRecover': stringGen(20),
            'codes.passwordRecoverDate': getDateTime(),
        }
        managerDB.edit(condition, user, "users", function (result) {
            if (result == null) {
                let response = render(req.session, 'views/error_view.html',
                    {
                        mensaje: "No se encontró ningún usuario. Lo sentimos"
                    });
                res.send(response);
            } else {
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
                        "<p>https://localhost:8081/recover/" + user["codes.passwordRecover"] + "</p>"
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

    function getDateTime() {
        let date = new Date();

        let hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        let min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        let sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        let year = date.getFullYear();

        let month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        let day = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
    }

    function expirated(dateToday,expirationDateUser){
        let todaySecs = convertToInt(dateToday);
        let expSecs = convertToInt(expirationDateUser);

        if((todaySecs - expSecs) > 300)
            return true;
        return false;
    }

    function convertToInt(date){
        let array = date.split(':');

        let integer = (parseInt(array[0])*31536000) + (parseInt(array[1])*2592000) +
            (parseInt(array[2])*86400) + (parseInt(array[3])*3600) + (parseInt(array[4])*60) + (parseInt(array[5]));
        return integer;
    }
    };



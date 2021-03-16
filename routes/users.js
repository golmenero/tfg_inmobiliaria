let userModel = require('../database/userModel');

module.exports = function (app, render, nodemailer, variables, utilities, mongoose) {
    app.get("/user/verification/:code", async function (req, res) {
        let condition = {'codes.emailActivation': req.params.code}
        let user = {"active": true,}
        let result = await userModel.findOneAndUpdate(condition, user);
        if (result === null) {
            req.flash('error', "Su correo no se ha podido verificar correctamente.")
        } else {
            req.flash('success', "Su correo electrónico se ha verificado correctamente.")
        }
        res.redirect("/login");
    });

    app.get("/recover/:code", async function (req, res) {
        let dateToday = utilities.getDateTime();
        let condition = {'codes.passwordRecover': req.params.code}

        let user = await userModel.findOne(condition);
        if (user === null) {
            req.flash('error', "No se encontro ninguna cuenta con esta información. Vuelva a intentarlo.");
            res.redirect('/login');
        } else {
            let expirationDateUser = user.codes.passwordRecoverDate;
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
    });

    app.post("/recover/:code", async function (req, res) {
        let code = req.params.code;
        let password = req.body.password;
        let passwordR = req.body.passwordR;

        if (password != passwordR) {
            req.flash('error', "Las contraseñas no coinciden.");
            res.redirect('/recover/' + code);
        } else {
            let condition = {"codes.passwordRecover": code}
            let seguro = app.get("crypto").createHmac('sha256', app.get('key')).update(password).digest('hex');
            let user = {password: seguro}

            let result = await userModel.findOneAndUpdate(condition, user);
            if (result === null) {
                req.flash('error', "Ocurrio un error al modificar su contraseña.");
                res.redirect('/recover/code/' + code);
            } else {
                req.flash('success', 'Contraseña actualizada correctamente.');
                res.redirect("/login");
            }
        }
    });

    // EDITAR CONTRASEÑA USUARIOS
    app.get('/user/edit', async function (req, res) {
        let condition = {"_id": mongoose.mongo.ObjectID(req.session.user._id)};
        let user = userModel.findOneAndUpdate(condition);
        if (user == null) {
            req.flash('error', "No se pudo encontrar al usuario.");
            res.redirect("/properties/" + req.session.typeProp);
        } else {
            let response = render(req.session, 'views/user_modify.html',
                {
                    user: user,
                    error: req.flash('error'),
                    success: req.flash('success')
                });
            res.send(response);
        }
    });

    app.post('/user/edit', async function (req, res) {
        let user = {};
        (req.body.name != "") ? user["name"] = req.body.name : user;
        (req.body.surname != "") ? user["surname"] = req.body.surname : user;

        if (req.body.password != "") {
            let seguro = app.get("crypto").createHmac('sha256', app.get('key')).update(req.body.password).digest('hex');
            user["password"] = seguro;
        }
        let id = req.session.user._id;
        let condition = {"_id": mongoose.mongo.ObjectId(id)};

        let result = await userModel.findOneAndUpdate(condition, user);
        if (result === null) {
            req.flash('error', "Ocurrió un error al modificar su perfil.");
        } else {
            req.flash('success', "Su perfil se ha modificado correctamente.");
        }
        res.redirect("/properties/" + req.session.typeProp);
    });

    app.post("/user/delete", async function (req, res) {
        if (req.session.user.permission != 'S') {
            let encrypted = app.get("crypto").createHmac('sha256', app.get('key'))
                .update(req.body.password).digest('hex');
            let condition = {"_id": mongoose.mongo.ObjectId(req.session.user._id)};
            if (encrypted == req.session.user.password) {
                let result = await userModel.deleteOne(condition);
                if (result == null) {
                    req.flash('error', "No se pudo eliminar el usuario.");
                    res.redirect("/properties/" + req.session.typeProp);
                } else {
                    req.session.user = null;
                    req.flash('success', "Usuario eliminado correctamente.");
                    res.redirect("/login");
                }
            } else {
                req.flash('error', "Contraseña incorrecta.");
                res.redirect("/properties/" + req.session.typeProp);
            }
        } else {
            req.flash('error', "El administrador no puede eliminar su cuenta, lo sentimos.");
            res.redirect("/properties/" + req.session.typeProp);
        }
    });

    app.get('/disconnect', function (req, res) {
        req.session.user = null;
        res.redirect('/login');
    })

    app.post('/recover', async function (req, res) {
        let condition = {email: req.body.correoRecuperacion}
        let user = {
            'codes.passwordRecover': utilities.stringGen(20),
            'codes.passwordRecoverDate': utilities.getDateTime(),
        }
        let userFound = await userModel.findOne(condition);
        if (userFound === null) {
            req.flash('error', "No se encontró ningún usuario con ese correo electrónico.");
            res.redirect("/login");
        } else if (userFound.permission == 'S' || userFound.permission == 'A') {
            req.flash('error', "Un agente no puede modificar su contraseña. Póngase en contacto con su administrador.");
            res.redirect('/login');
        } else {
            // No necesitamos comprobar que sea null porque ya lo hacemos en la primera query.
            await userModel.findOneAndUpdate(condition, user);
            // Preparamos y enviamos el correo electrónico de recuperación
            let transporter = utilities.createTransporter();
            let mailOptions = utilities.createMailOptions(req.body.correoRecuperacion, 'Reestablezca su Contraseña',
                "<h1>Haga click en el siguiente enlace para reestablecer su contraseña.</h1>" +
                "<p>https://localhost:8081/recover/" + user["codes.passwordRecover"] + "</p>");

            transporter.sendMail(mailOptions, function (error) {
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

    app.get("/signin", function (req, res) {
        let respuesta = render(req.session, 'views/user_signin.html', {
            user: req.session.user,
            error: req.flash('error'),
            success: req.flash('success')
        });
        res.send(respuesta);
    });

    app.post('/signin', async function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('key')).update(req.body.password).digest('hex');
        let condition1 = {
            email: req.body.email,
        }
        // Intentamos obtener el usuario por el email
        let user = await userModel.findOne(condition1);
        if (user === null) {
            let user = new userModel({
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
            });

            let transporter = utilities.createTransporter();
            let mailOptions = utilities.createMailOptions(req.body.email, 'Verifique su correo electrónico.',
                "<h1>Gracias por registrarse en nuestra aplicación</h1>" +
                "<h2>Verifique su correo electrónico haciendo click en el siguiente enlace:</h2>" +
                "<p>https://localhost:8081/user/verification/" + user.codes.emailActivation + "</p>");

            transporter.sendMail(mailOptions, async function (error) {
                if (error) {
                    req.flash('error', "Ocurrió un error inesperado al enviar el correo de verificación.")
                    res.redirect("/login");
                } else {
                    let user = await user.save();
                    if (user === null) {
                        req.flash('error', "Ocurrió un error inesperado al añadir su usuario al sistema.")
                    } else {
                        req.flash('success', "Se ha enviado un mensaje a su bandeja de entrada. Revísela para activar su perfil.")
                        res.redirect("/login");
                    }
                }
            })
            // Si ya existe un usuario.
        } else {
            req.flash('error', "Este correo electrónico ya pertenece a una cuenta. Intente usar uno diferente.")
            res.redirect("/signin");
        }

    });

    app.get("/login", function (req, res) {
        let response = render(req.session, 'views/user_login.html', {
            user: req.session.user,
            error: req.flash("error"),
            success: req.flash("success")
        });
        res.send(response);
    });

    app.post("/login", async function (req, res) {
        let decrypted = app.get("crypto").createHmac('sha256', app.get('key'))
            .update(req.body.password).digest('hex');

        let condition = {
            email: req.body.email,
            password: decrypted
        }
        let user = await userModel.findOne(condition);
        if (user === null) {
            req.flash('error', "Usuario y/o contraseña incorrectos")
            req.session.user = null;
            res.redirect("/login");
        } else {
            if (user.active == true) {
                req.session.user = user;
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
}
;



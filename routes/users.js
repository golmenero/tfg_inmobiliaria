let userModel = require('../database/userModel');

module.exports = function (app, render, nodemailer, variables, utilities, mongoose, encrypter) {

    /**
     * Peticion GET
     * Método que permite verificar el perfil de usuario basándose en un código.
     * :code -> El código de verificación de usuario.
     */
    app.get("/users/verification/:code", async function (req, res) {
        let condition = {'codes.emailActivation': req.params.code}
        let user = {"active": true}
        let result = await userModel.findOneAndUpdate(condition, user);
        if (result === null) {
            req.flash('error', ["Su correo no se ha podido verificar correctamente."])
        } else {
            req.flash('success', ["Su correo electrónico se ha verificado correctamente."])
        }
        res.redirect("/login");
    });

    /**
     * Peticion GET
     * Muestra la pantalla de recuperación de contraseña.
     * :code -> El código de recuperación de contraseña.
     */
    app.get("/recover/:code", async function (req, res) {
        let dateToday = utilities.getDateTime();
        let condition = {'codes.passwordRecover': req.params.code}

        let user = await userModel.findOne(condition);
        if (user === null) {
            req.flash('error', ["No se encontro ninguna cuenta con esta información. Vuelva a intentarlo."]);
            res.redirect('/login');
        } else {
            let expirationDateUser = user.codes.passwordRecoverDate;
            if (utilities.expirated(dateToday, expirationDateUser)) {
                req.flash('error', ["Su enlace de recuperación de contraseña ha caducado."]);
                res.redirect('/login');
            } else {
                let respuesta = render(req.session, 'views/users/user_passwordRecover.html', {
                    passwordRecover: req.params.code,
                    error: req.flash('error'),
                    success: req.flash('success')
                });
                res.send(respuesta);
            }
        }
    });

    /**
     * Peticion POST
     * Obtiene la nueva contraseña introducida por el usuario y, si esta cumple con los requisitos, se actualiza.
     * :code -> El código de recuperación de contraseña.
     */
    app.post("/recover/:code", async function (req, res) {
        let code = req.params.code;
        let password = req.body.password;
        let passwordR = req.body.passwordR;

        if (password != passwordR) {
            req.flash('error', ["Las contraseñas no coinciden."]);
            res.redirect('/recover/' + code);
        } else {
            let condition = {"codes.passwordRecover": code}
            let seguro = encrypter.encrypt(password);
            let user = {password: seguro}

            let result = await userModel.findOneAndUpdate(condition, user);
            if (result === null) {
                req.flash('error', "Ocurrió un error al modificar su contraseña.");
                res.redirect('/recover/code/' + code);
            } else {
                req.flash('success', 'Contraseña actualizada correctamente.');
                res.redirect("/login");
            }
        }
    });

    /**
     * Peticion GET
     * Muestra la pantalla de edición de usuario con los datos del usuario cargado en sesión.
     */
    app.get('/users/edit', async function (req, res) {
        let condition = {"_id": mongoose.mongo.ObjectID(req.session.user._id)};
        let user = userModel.findOneAndUpdate(condition);
        if (user == null) {
            req.flash('error', ["No se pudo encontrar al usuario."]);
            res.redirect("/properties/vivienda");
        } else {
            let response = render(req.session, 'views/users/user_modify.html',
                {
                    user: user,
                    error: req.flash('error'),
                    success: req.flash('success')
                });
            res.send(response);
        }
    });

    /**
     * Peticion POST
     * Actualiza el usuario en sesión con los datos introducidos.
     */
    app.post('/users/edit', async function (req, res) {
        if(req.body.password != req.body.passwordR){
            req.flash('error', ["Las contraseñas no coinciden."])
            res.redirect("/users/edit");
        }
        else {
            let oldPass = req.body.oldPassword;

            let user = {
                name: req.body.name,
                surname: req.body.surname
            };

            // Si alguna las dos nuevas contraseñas queda vacía, la contraseña no se modifica
            if(req.body.password != "" && req.body.passwordR != ""){
                utilities.addIfExists("password", encrypter.encrypt(req.body.password), user);
            }

            let id = req.session.user._id;
            let condition = {"_id": mongoose.mongo.ObjectId(id)};

            // Hacemos el proceso de actualizacion de otra manera para poder correr los validadores de mongoose
            let oldUser = await userModel.findOne(condition);
            if (oldUser.password == encrypter.encrypt(oldPass)) {
                let userM = new userModel(utilities.updateIfNecessary(oldUser, user));
                let error = userM.validateSync();

                if (!error) {
                    let result = await userM.save();
                    if (result === null) {
                        req.flash('error', ["Ocurrió un error al modificar su perfil."]);
                    } else {
                        req.flash('success', ["Su perfil se ha modificado correctamente."]);
                    }
                    res.redirect("/home");
                } else {
                    let errorMsgs = utilities.getErrors(error.errors);
                    req.flash('error', errorMsgs)
                    res.redirect("/users/edit");
                }
            } else {
                req.flash('error', ["Contraseña Incorrecta. Inténtelo de nuevo."]);
                res.redirect("/users/edit");
            }
        }
    });

    /**
     * Peticion POST
     * Elimina por completo la cuenta del usuario cargado en sesión.
     */
    app.post("/users/delete", async function (req, res) {
        if (req.session.user.permission != 'S') {
            let encrypted = encrypter.encrypt(req.body.password);
            let condition = {"_id": mongoose.mongo.ObjectId(req.session.user._id)};
            if (encrypted == req.session.user.password) {
                let result = await userModel.deleteOne(condition);
                if (result == null) {
                    req.flash('error', ["No se pudo eliminar el usuario."]);
                    res.redirect("/home");
                } else {
                    req.session.user = null;
                    req.flash('success', ["Usuario eliminado correctamente."]);
                    res.redirect("/login");
                }
            } else {
                req.flash('error', ["Contraseña incorrecta."]);
                res.redirect("/home");
            }
        } else {
            req.flash('error', ["Un super-agente no puede eliminar su cuenta, lo sentimos."]);
            res.redirect("/home");
        }
    });

    /**
     * Peticion GET
     * Elimina al usuario de sesión.
     */
    app.get('/disconnect', function (req, res) {
        req.session.user = null;
        res.redirect('/login');
    })

    /**
     * Peticion POST
     * Comprueba que sea posible editar la contraseña y, si lo es, envía un correo electrónico.
     */
    app.post('/recover', async function (req, res) {
        let condition = {email: req.body.correoRecuperacion}
        let user = {
            'codes.passwordRecover': utilities.stringGen(20),
            'codes.passwordRecoverDate': utilities.getDateTime(),
        }
        let userFound = await userModel.findOne(condition);
        if (userFound === null) {
            req.flash('error', ["No se encontró ningún usuario con ese correo electrónico."]);
            res.redirect("/login");
        } else if (userFound.permission == 'S' || userFound.permission == 'A') {
            req.flash('error', ["Un agente no puede modificar su contraseña. Póngase en contacto con su administrador."]);
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
                    req.flash('error', ["Ocurrió un error al enviar su correo de reestablecimiento de contraseña."]);
                    res.redirect("/login");
                } else {
                    req.flash('success', ["Se ha enviado un mensaje a su correo con instrucciones para reestablecer su contraseña."]);
                    res.redirect("/login");
                }
            })
        }
    });

    /**
     * Peticion GET
     * Muestra la pantalla de registro.
     */
    app.get("/signin", function (req, res) {
        let respuesta = render(req.session, 'views/users/user_signin.html', {
            error: req.flash('error'),
            success: req.flash('success')
        });
        res.send(respuesta);
    });

    /**
     * Peticion POST
     * Obtiene los datos de registro, los valida y, si son válidos, crea al nuevo usuario y
     * lo añade a la Base de Datos.
     */
    app.post('/signin', async function (req, res) {
        if(req.body.password != req.body.passwordR){
            req.flash('error', ["Las contraseñas no coinciden."])
            res.redirect("/signin");
        }
        else {
            let seguro = encrypter.encrypt(req.body.password);
            let condition1 = {
                email: req.body.email,
            }
            // Intentamos obtener el usuario por el email
            let user = await userModel.findOne(condition1);
            if (user === null) {
                let newUser = new userModel({
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
                let error = newUser.validateSync();
                if (!error) {
                    let transporter = utilities.createTransporter();
                    let mailOptions = utilities.createMailOptions(req.body.email, 'Verifique su correo electrónico.',
                        "<h1>Gracias por registrarse en nuestra aplicación</h1>" +
                        "<h2>Verifique su correo electrónico haciendo click en el siguiente enlace:</h2>" +
                        "<p>https://localhost:8081/users/verification/" + newUser.codes.emailActivation + "</p>");

                    transporter.sendMail(mailOptions, async function (error) {
                        if (error) {
                            req.flash('error', ["Ocurrió un error inesperado al enviar el correo de verificación."])
                            res.redirect("/login");
                        } else {
                            let response = await newUser.save();
                            if (response === null) {
                                req.flash('error', ["Ocurrió un error inesperado al añadir su usuario al sistema."])
                            } else {
                                req.flash('success', ["Se ha enviado un mensaje a su bandeja de entrada. Revísela para activar su perfil."])
                                res.redirect("/login");
                            }
                        }
                    })
                } else {
                    let errorMsgs = utilities.getErrors(error.errors);
                    req.flash('error', errorMsgs)
                    res.redirect("/signin");
                }
            } else {
                req.flash('error', ["Este correo electrónico ya pertenece a una cuenta. Utilice uno diferente."])
                res.redirect("/signin");
            }
        }
    });

    /**
     * Peticion GET
     * Muestra la pantalla de inicio de sesión.
     */
    app.get("/login", function (req, res) {
        let response = render(req.session, 'views/users/user_login.html', {
            error: req.flash("error"),
            success: req.flash("success")
        });
        res.send(response);
    });

    /**
     * Peticion POST
     * Obtiene los datos de inicio de sesión y, si son correctos, carga al usuario en sesión.
     */
    app.post("/login", async function (req, res) {
        let decrypted = encrypter.encrypt(req.body.password);

        let condition = {
            email: req.body.email,
            password: decrypted
        }
        let user = await userModel.findOne(condition);
        if (user === null) {
            req.flash('error', ["Usuario y/o contraseña incorrectos."])
            req.session.user = null;
            res.redirect("/login");
        } else {
            if (user.active == true) {
                req.session.user = user;
                req.flash('success', ["Ha iniciado sesión correctamente."])

                res.redirect('/home');
            } else {
                req.flash('error', ["Su correo no ha sido verificado. Revise su bandeja de entrada."])
                res.redirect("/login");
            }
        }
    });
}
;



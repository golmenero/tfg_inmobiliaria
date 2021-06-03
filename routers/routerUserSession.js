module.exports = function (app,express ) {
    let routerUserSession = express.Router();
    let exclusiveRouterUserSession = express.Router();

    routerUserSession.use(function (req, res, next) {
        if(!req.session.user){
            req.flash('error', ["Debe iniciar sesión para poder acceder a esta página, lo sentimos."])
            res.redirect("/login");
        }
        else if (!((req.session.user.permission == 'U')||(req.session.user.permission == 'A')|| (req.session.user.permission == 'S'))) {
            req.flash('error', ["Debe ser un usuario registrado para poder acceder a ésta página, lo sentimos."])
            res.redirect("/home");
        } else {
            next();
        }
    });

    exclusiveRouterUserSession.use(function (req, res, next) {
        if(!req.session.user){
            req.flash('error', ["Debe iniciar sesión para poder acceder a esta página, lo sentimos."])
            res.redirect("/login");
        }
        else if (!(req.session.user.permission == 'U')) {
            req.flash('error', ["Debe ser un usuario registrado para poder acceder a ésta página, lo sentimos."])
            res.redirect("/home");
        } else {
            next();
        }
    });

    app.use("/conversations", routerUserSession);
    app.use("/conversations/*", routerUserSession);
    app.use("/notifications/load", routerUserSession);

    app.use("/wishes/*", routerUserSession);
    app.use("/wishes", routerUserSession);

    app.use("/users/edit", exclusiveRouterUserSession);
    app.use("/users/delete", exclusiveRouterUserSession);
};
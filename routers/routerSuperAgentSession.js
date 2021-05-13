module.exports = function (app,express ) {
    let routerSuperAgentSession = express.Router();

    routerSuperAgentSession.use(function (req, res, next) {
        if(!req.session.user){
            req.flash('error', ["Debe iniciar sesión para poder acceder a esta página, lo sentimos."])
            res.redirect("/login");
        }
        else if (!(req.session.user.permission == 'S')) {
            req.flash('error', ["Debe ser un administrador para poder acceder a ésta página, lo sentimos."])
            res.redirect("/home");
        } else {
            next();
        }
    });

    app.use("/agents", routerSuperAgentSession);
    app.use("/agents/*", routerSuperAgentSession);

    app.use("/info/contact/edit", routerSuperAgentSession);
    app.use("/info/statistics", routerSuperAgentSession);

};
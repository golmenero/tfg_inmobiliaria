module.exports = function (app,express ) {
    let routerAgentSession = express.Router();

    routerAgentSession.use(function (req, res, next) {
        if(!req.session.user){
            req.flash('error', ["Debe iniciar sesión para poder acceder a esta página, lo sentimos."])
            res.redirect("/login");
        }
        else if (!((req.session.user.permission == 'A') || (req.session.user.permission == 'S'))) {
            req.flash('error', ["Debe ser un agente registrado para poder acceder a ésta página, lo sentimos."])
            res.redirect("/home");
        } else {
            next();
        }
    });

    app.use("/properties/edit/*", routerAgentSession);
    app.use("/properties/delete/*", routerAgentSession);
    app.use("/properties/add", routerAgentSession);
    app.use("/myproperties", routerAgentSession);
};
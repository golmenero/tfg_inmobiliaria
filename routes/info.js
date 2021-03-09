module.exports = function (app, render, managerDB, variables) {
    app.get("/info", function (req, res) {
        let condition = {active: true};
        managerDB.get(condition, "info", function (infos) {
            let info = {}
            if (infos != null) {
                info = infos[0]
            }
            let respuesta = render(req.session, 'views/info.html', {
                info: info,
                user: req.session.user,
                error: req.flash('error'),
                success: req.flash('success')
            });
            res.send(respuesta);
        })
    });

    app.post("/info/edit", function (req, res) {
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
                        res.redirect('/info');
                    } else {
                        req.flash('success', "La información se editó correctamente.")
                        res.redirect('/info');
                    }
                })
            } else {
                req.flash('success', "La información se editó correctamente.")
                res.redirect('/info');
            }
        })
    });
}
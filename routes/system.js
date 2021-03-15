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
}


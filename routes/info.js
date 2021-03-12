module.exports = function (app, render, managerDB, variables) {
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
            let array = [sizeMonth(result, 1), sizeMonth(result, 2), sizeMonth(result, 3), sizeMonth(result, 4),
                sizeMonth(result, 5), sizeMonth(result, 6), sizeMonth(result, 7), sizeMonth(result, 8),
                sizeMonth(result, 9), sizeMonth(result, 10), sizeMonth(result, 11), sizeMonth(result, 12)];

            let arrayType = [typeThisMonth(result, 'vivienda'), typeThisMonth(result, 'local'), typeThisMonth(result, 'suelo')];

            let arrayTypeYear = [typeThisYear(result, 'vivienda'), typeThisYear(result, 'local'), typeThisYear(result, 'suelo')];


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

    function sizeMonth(array, monthI) {
        return Object.values(array).filter(element => element.month == monthI).length;
    }

    function typeThisMonth(array, type) {
        return Object.values(array).filter(element => element.propertyType == type).filter(element => element.month == new Date().getMonth() + 1).length;
    }

    function typeThisYear(array, type) {
        return Object.values(array).filter(element => element.propertyType == type).filter(element => element.year == new Date().getFullYear()).length;
    }

}


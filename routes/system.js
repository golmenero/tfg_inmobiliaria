let loggerModel = require('../database/loggerModel')
let infoModel = require('../database/infoModel')

module.exports = function (app, render, variables, utilities) {
    app.get('/home', function (req, res) {
        let response = render(req.session, 'views/index.html',
            {
                error: req.flash('error'),
                success: req.flash('success')
            });
        res.send(response);

    });

    app.get("/info/contact", async function (req, res) {
        let condition = {active: true};
        let info = await infoModel.findOne(condition);
        let respuesta = render(req.session, 'views/info_contact.html', {
            info: info,
            user: req.session.user,
            error: req.flash('error'),
            success: req.flash('success')
        });
        res.send(respuesta);
    });

    app.post("/info/contact/edit", async function (req, res) {
        let condition = {active: true};
        let info = {active: true};
        (req.body.phones != "") ? info["phones"] = req.body.phones : info;
        (req.body.emails != "") ? info["emails"] = req.body.emails : info;

        let result = await infoModel.findOneAndUpdate(condition, info);
        if (result == null) {
            let newInfo = new infoModel(info);
            let response = await newInfo.save();
            if (response == null) {
                req.flash('error', "La información no se pudo editar correctamente.")
                res.redirect('/info/contact');
            }
        }
        req.flash('success', "La información se editó correctamente.")
        res.redirect('/info/contact');

    });

    app.get("/info/statistics", async function (req, res) {
        let condition = {
            type: 'wish'
        }
        let result = await loggerModel.find(condition);

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
}


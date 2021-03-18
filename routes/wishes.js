let userModel = require('../database/userModel');
let propertyModel = require('../database/propertyModel');
let loggerModel = require('../database/loggerModel');

module.exports = function (app, render, nodemailer, variables, utilities, mongoose) {

    // PROPIEDADES GUARDADAS
    app.post("/wishes/:id", async function (req, res) {
        let condition = {email: req.session.user.email};
        let user = {$push: {wishes: req.params.id}}

        let result = await userModel.findOneAndUpdate(condition, user);
        if (result == null) {
            req.flash('error', "No se pudo añadir a las listas de seguimiento correctamente.")
            res.redirect("/properties");
        } else {
            req.flash('success', "Añadido a las listas de seguimiento correctamente.")
            req.session.user.wishes.push(req.params.id);

            let condition = {"_id": mongoose.mongo.ObjectID(req.params.id)};
            let property = await propertyModel.findOne(condition);
            let logger = new loggerModel({
                type: "wish",
                propertyType: property.type,
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
            });
            await logger.save();
        }
        res.redirect("/wishes")
    });

    app.get("/wishes/delete/:id", async function (req, res) {
        let condition = {email: req.session.user.email};
        let user = {$pull: {wishes: req.params.id}}

        let response = await userModel.findOneAndUpdate(condition, user);
        if (response == null) {
            req.flash('error', "No se pudo eliminar de las listas de seguimiento correctamente.")
        } else {
            req.flash('success', "Eliminado de las listas de seguimiento correctamente.")
            utilities.removeItemOnce(req.session.user.wishes, req.params.id);
        }
        res.redirect("/wishes");
    });

    app.get("/wishes", async function (req, res) {
        let condition = {"email": req.session.user.email};

        let users = await userModel.find(condition);
        if (users == null) {
            req.flash('error', "No se pudo encontrar su usuario al añadir su seguimiento.")
            res.redirect("/properties");
        } else {
            let mapWishes = users[0].wishes.map(function (obj) {
                return mongoose.mongo.ObjectID(obj)
            })
            let condition2 = {"_id": {$in: mapWishes}}

            let properties = await propertyModel.find(condition2);
            if (properties != null) {
                let response = render(req.session, 'views/wishes_mywishes.html',
                    {
                        properties: properties,
                        error: req.flash('error'),
                        success: req.flash('success')
                    });
                res.send(response);
            }
        }
    });
}
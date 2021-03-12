module.exports = function (app, render, nodemailer, managerDB, variables) {

    // PROPIEDADES GUARDADAS
    app.post("/wishes/:id", function (req, res) {
        let condition = {
            email: req.session.user.email
        };
        let idWish = req.params.id;
        managerDB.pushWish(condition, idWish, "users", function (users) {
            if (users == null) {
                req.flash('error', "No se pudo añadir a las listas de seguimiento correctamente.")
                res.redirect("/properties");
            } else {
                req.flash('success', "Añadido a las listas de seguimiento correctamente.")
                req.session.user.wishes.push(idWish);

                let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)};
                managerDB.get(condition, "properties", function(result){
                    let logger = {
                        type: "wish",
                        propertyType: result[0].type,
                        year: new Date().getFullYear(),
                        month: new Date().getMonth()+1,
                    }
                    managerDB.add(logger, "logger", function(result){
                        res.redirect("/wishes");
                    });
                })
            }
        });
    });

    app.get("/wishes/delete/:id", function (req, res) {
        let condition = {
            email: req.session.user.email
        };
        let idWish = req.params.id;
        managerDB.pullWish(condition, idWish, "users", function (users) {
            if (users == null) {
                req.flash('error', "No se pudo eliminar de las listas de seguimiento correctamente.")
            } else {
                req.flash('success', "Eliminado de las listas de seguimiento correctamente.")
                removeItemOnce(req.session.user.wishes, idWish);
            }
            res.redirect("/wishes");
        });
    });

    app.get("/wishes", async function (req, res) {
        let condition = {
            "email": req.session.user.email
        };
        managerDB.get(condition, "users",function (users) {
            if (users == null) {
                req.flash('error', "No se pudo encontrar su usuario al añadir su seguimiento.")
                res.redirect("/properties");
            } else {
                let mapWishes = users[0].wishes.map(function(obj){ return managerDB.mongo.ObjectID(obj)})
                let condition2 = {
                    "_id" : {$in : mapWishes},
                }
                managerDB.get(condition2, 'properties', function (properties){
                    if (properties != null){
                        let response = render(req.session, 'views/wishes_mywishes.html',
                            {
                                properties: properties,
                                user: req.session.user,
                                error: req.flash('error'),
                                success: req.flash('success')
                            });
                        res.send(response);
                    }
                })
            }
        });
    });

    function removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }
}
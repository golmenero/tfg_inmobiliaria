module.exports = function (app, render, nodemailer, managerDB, variables, utilities) {
    app.get("/conversations/add/:id", function (req, res) {
        let idProperty = req.params.id;
        let emailUser = req.session.user.email;
        let emailAgent = variables.EMAILAGENTCONVERSATION;

        let condition;
        if (req.session.user.permission == 'S') {
            condition = {
                $or: [{
                    "agentId": managerDB.mongo.ObjectID(req.params.id)
                },
                    {
                        "userId": managerDB.mongo.ObjectID(req.params.id)
                    }]
            }
            managerDB.get(condition, "conversations", function (conversations) {
                if (conversations == null) {
                    req.flash('error', "No se encontraron conversaciones.")
                    res.redirect("/properties");
                } else {
                    let response = render(req.session, 'views/conversations.html',
                        {
                            conversations: conversations,
                            user: req.session.user,
                            error: req.flash('error'),
                            success: req.flash('success')
                        });
                    res.send(response);
                }
            });
        }
    });

    app.get("/conversations", function (req, res) {
        let condition;
        if (req.session.user.permission == 'S') {
            condition = {
                $or: [{
                    "agentId": managerDB.mongo.ObjectID(req.params.id)
                },
                    {
                        "userId": managerDB.mongo.ObjectID(req.params.id)
                    }]
            }
            managerDB.get(condition, "conversations", function (conversations) {
                if (conversations == null) {
                    req.flash('error', "No se encontraron conversaciones.")
                    res.redirect("/properties");
                } else {
                    let response = render(req.session, 'views/conversations.html',
                        {
                            conversations: conversations,
                            user: req.session.user,
                            error: req.flash('error'),
                            success: req.flash('success')
                        });
                    res.send(response);
                }
            });
        }
    });

    app.get("/messages", function (req, res) {

        let respuesta = render(req.session, 'views/messages.html', {
            messages: blabla,
            user: req.session.user,
            error: req.flash('error'),
            success: req.flash('success')
        });
        res.send(respuesta);
    });

}
;
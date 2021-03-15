module.exports = function (app, render, nodemailer, managerDB, variables, utilities) {
    app.get("/conversations/add/:id", function (req, res) {
        let idProperty = managerDB.mongo.ObjectID(req.params.id);
        let emailSession = req.session.user.email;
        let emailAgent = variables.EMAILAGENTCONVERSATION;

        let condition = {
            $or: [{
                "agentEmail": emailSession
            },
                {
                    "userEmail": emailSession
                }]
        }
        managerDB.get(condition, "conversations", function (conversations) {
            if (conversations == null || conversations.length == 0) {
                let conversation = {
                    "agentEmail": emailAgent,
                    "userEmail": emailSession,
                    "propertyId": idProperty,
                    messages: [],
                }
                managerDB.add(conversation, "conversations", function (id) {
                    if (id != null) {
                        res.redirect("/conversations/" + id);
                    } else {
                        req.flash('error', "No se ha podido añadir la conversacion.")
                        res.redirect("/properties");
                    }
                })
            } else {
                res.redirect("/conversations/" + conversations[0]._id.toString());
            }
        });
    });

    app.get("/conversations/chat/:id", function (req, res) {
        let email = req.session.user.email;
        let condition = {"_id": managerDB.mongo.ObjectID(req.params.id)}
        managerDB.get(condition, "conversations", function (conversations) {
            if (conversations == null || conversations.length == 0) {
                req.flash('error', "No se ha podido encontrar la conversacion.")
                res.redirect("/conversations");
            } else {
                let response = render(req.session, 'views/conversations_chat.html',
                    {
                        conversations: conversations[0],
                        user: req.session.user,
                        error: req.flash('error'),
                        success: req.flash('success')
                    });
                res.send(response);
            }
        });
    });

    app.get("/conversations", function (req, res) {
        let email = req.session.user.email;
        let condition = {
            $or: [{
                "agentEmail": email,
            },
                {
                    "userEmail": email,
                }]
        }
        managerDB.get(condition, "conversations", function (conversations) {
            let response = render(req.session, 'views/conversations.html',
                {
                    conversations: conversations,
                    user: req.session.user,
                    error: req.flash('error'),
                    success: req.flash('success')
                });
            res.send(response);
        });
    });

}
;
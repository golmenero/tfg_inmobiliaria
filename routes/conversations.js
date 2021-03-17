let conversationModel = require('../database/conversationModel');
let userModel = require('../database/userModel');
let agentModel = require('../database/agentModel');

module.exports = function (app, render, nodemailer, variables, utilities, mongoose) {
    app.get("/conversations/add/:id", async function (req, res) {
        let property = mongoose.mongo.ObjectID(req.params.id);

        // El usuario siempre es el que crea la conversación.
        let user = await userModel.findOne({email: req.session.user.email}).distinct('_id');
        let agent = await agentModel.findOne({email: variables.EMAILAGENTCONVERSATION}).distinct('_id');

        let condition = {
            user: user,
            agent: agent,
            property: property,
        }

        // Buscamos la conversacion
        let conversation = await conversationModel.findOne(condition);
        if (conversation == null) {
            // Si no la encuentra, lo añadimos
            let msg = {
                messages : [{
                    from: "S",
                    text: "¡Hola! Escríbenos un mensaje y un agente te responderá a la mayor brevedad posible. " +
                        "Si lo deseas, puedes encontrar otros métodos de contacto en la sección Contacto.",
                    date: utilities.getDateChat(),
                        time: utilities.getTimeChat(),
                }],
            }
            let conversacionNew = new conversationModel({...condition, ...msg});
            let response = await conversacionNew.save();
            if (response === null) {
                req.flash('error', "No se ha podido añadir la conversacion.")
                res.redirect("/properties/" + req.session.typeProp);
            } else {
                res.redirect("/conversations/chat/" + conversacionNew._id);
            }
        }
        // Si la encontramos, redirigimos
        else {
            res.redirect("/conversations/chat/" + conversation._id.toString());
        }
    });

    app.get("/conversations/chat/:id", async function (req, res) {
        let condition = {"_id": mongoose.mongo.ObjectID(req.params.id)}

        let conversation = await conversationModel.findOne(condition).populate('property');
        if (conversation == null) {
            req.flash('error', "No se ha podido encontrar la conversacion.")
            res.redirect("/conversations");
        } else {
            let response = render(req.session, 'views/conversations_chat.html',
                {
                    conversation: conversation,
                    user: req.session.user,
                    error: req.flash('error'),
                    success: req.flash('success')
                });
            res.send(response);
        }
    });

    app.get("/conversations", async function (req, res) {
        let userId = await userModel.find({email: req.session.user.email}).distinct("_id");
        let condition = {
            $or: [{
                "agent": userId,
            },
                {
                    "user": userId,
                }]
        }

        let conversations = await conversationModel.find(condition).populate('agent').populate('user').populate('property');
        let response = render(req.session, 'views/conversations.html',
            {
                conversations: conversations,
                user: req.session.user,
                error: req.flash('error'),
                success: req.flash('success')
            });
        res.send(response);
    });

    app.post("/conversations/send/:id", async function (req, res) {
        let condition = {"_id": mongoose.mongo.ObjectID(req.params.id)}
        if (req.body.messageInput.length === 0 || !req.body.messageInput.trim()) {
            req.flash('error', "No puede enviar un mensaje vacío.")
            res.redirect('/conversations/chat/' + req.params.id);
        } else {
            let message = {
                $push: {
                    messages: {
                        from: req.session.user.permission,
                        text: req.body.messageInput
                    }
                }
            }

            let result = await conversationModel.findOneAndUpdate(condition, message)
            if (result === null)
                req.flash('error', "No se ha podido enviar el mensaje.")
            res.redirect('/conversations/chat/' + req.params.id);
        }
    });

}
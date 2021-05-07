let conversationModel = require('../database/conversationModel');
let userModel = require('../database/userModel');
let agentModel = require('../database/agentModel');

module.exports = function (app, render, nodemailer, variables, utilities, mongoose) {
    /**
     * Peticion GET
     * Crea la nueva conversación abierta por el cliente y la muestra en pantalla.
     * :id -> El id de la propiedad sobre la cual se va a crear la conversación.
     */
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
                messages: [{
                    from: "S",
                    text: "¡Hola! Escríbenos un mensaje y un agente te responderá a la mayor brevedad posible. " +
                        "Si lo deseas, puedes encontrar otros métodos de contacto en la sección Contacto.",
                    date: utilities.getDateChat(),
                    time: utilities.getTimeChat(),
                    seen: true,
                }],
            }
            let conversacionNew = new conversationModel({...condition, ...msg});
            let response = await conversacionNew.save();
            if (response === null) {
                req.flash('error', "No se ha podido añadir la conversacion.")
                res.redirect("/home");
            } else {
                res.redirect("/conversations/chat/" + conversacionNew._id);
            }
        }
        // Si la encontramos, redirigimos
        else {
            res.redirect("/conversations/chat/" + conversation._id.toString());
        }
    });

    /**
     * Peticion GET
     * Muestra la pantalla de chat con el id aportado.
     * :id -> El id del chat que se desea abrir.
     */
    app.get("/conversations/chat/:id", async function (req, res) {
        let condition = {"_id": mongoose.mongo.ObjectID(req.params.id)}

        let conversation = await conversationModel.findOne(condition).populate('property');
        for (let i = 0; i < conversation.messages.length; i++) {
            if (conversation.messages[i].from != req.session.user.permission)
                conversation.messages[i].seen = true;
        }
        let response = await conversationModel.findOneAndUpdate(condition, conversation);

        if (conversation == null) {
            req.flash('error', "No se ha podido encontrar la conversacion.")
            res.redirect("/conversations");
        } else {
            let response = render(req.session, 'views/conversations/conversations_chat.html',
                {
                    conversation: conversation,
                    error: req.flash('error'),
                    success: req.flash('success')
                });
            res.send(response);
        }
    });

    /**
     * Peticion GET
     * Muestra una lista con las conversaciones del usuario.
     */
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

        let conversations = await conversationModel.find(condition)
            .populate('agent').populate('user').populate('property');

        // Asignamos los mensajes a las conversaciones
        for (let i = 0; i < conversations.length; i++) {
            let conversation = conversations[i];
            let countUnseen = conversation.messages.filter(msg => (!msg.seen && msg.from != req.session.user.permission)).length;
            conversation['unseenCount'] = countUnseen;
        }
        let response = render(req.session, 'views/conversations/conversations.html',
            {
                conversations: conversations,
                error: req.flash('error'),
                success: req.flash('success')
            });
        res.send(response);
    });

    /**
     * Peticion POST
     * Método encargado de actualizar la Base de Datos con el nuevo mensaje.
     * :id -> El id de la conversacion a la que pertenece.
     */
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
                        text: req.body.messageInput,
                        date: utilities.getDateChat(),
                        time: utilities.getTimeChat(),
                        seen: false,
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
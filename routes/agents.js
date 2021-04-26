let agentModel = require('../database/agentModel');

module.exports = function (app, render, nodemailer, variables, utilities, mongoose) {
    app.get('/agents', async function (req, res) {
        let condition = {
            permission: 'A'
        }
        condition = utilities.addIfExists("name", req.query.name, condition);
        condition = utilities.addIfExists("surname", req.query.surname, condition);
        condition = utilities.addIfExists("email", req.query.email, condition);

        let agents = await agentModel.find(condition);
        if (agents != null) {
            let respuesta = render(req.session, 'views/agents/agent_list.html', {
                agents: agents,
                error: req.flash('error'),
                success: req.flash('success')
            });
            res.send(respuesta);
        } else {
            req.flash('error', ["Ocurrió un error al listar los agentes."])
            res.redirect("/properties/vivienda");
        }
    });

    app.get('/agents/add', function (req, res) {
        let response = render(req.session, 'views/agents/agent_add.html', {
            error: req.flash('error'),
            success: req.flash('success')
        });
        res.send(response);
    })

    app.post('/agents/add', async function (req, res) {
        let agent = new agentModel({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            permission: 'A',
            password: app.get("crypto").createHmac('sha256', app.get('key')).update(req.body.password).digest('hex'),
            active: true
        });
        let anyAgente = await agentModel.findOne({email: req.body.email});
        if (anyAgente != null) {
            req.flash('error', ["Ya existe un agente con ese correo electrónico."])
            res.redirect('/agents');
        } else {
            let error = agent.validateSync();
            if (!error) {
                // Connect to DB
                let response = await agent.save();
                if (response === null) {
                    req.flash('error', ["El agente no se pudo añadir correctamente."])
                    res.redirect('/agents');
                } else {
                    req.flash('success', ["El agente se añadió correctamente."])
                    res.redirect('/agents');
                }
            } else {
                let errorMsgs = utilities.getErrors(error.errors);
                req.flash('error', errorMsgs)
                res.redirect("/agents/add");
            }
        }
    });

    app.get('/agents/edit/:id', async function (req, res) {
        let condition = {"_id": mongoose.Types.ObjectId(req.params.id)};
        let agent = await agentModel.findOne(condition);
        if (agent === null) {
            req.flash('error', ["El agente no se pudo editar correctamente."])
            res.redirect('/agents');
        } else {
            let response = render(req.session, 'views/agents/agent_modify.html', {
                agent: agent,
                error: req.flash('error'),
                success: req.flash('success')
            });
            res.send(response);
        }
    });

    app.post('/agents/edit/:id', async function (req, res) {
        let agent = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: app.get("crypto").createHmac('sha256', app.get('key')).update(req.body.password).digest('hex')
        }
        let condition = {"_id": mongoose.Types.ObjectId(req.params.id)};
        let oldAgent = await agentModel.findOne(condition);
        if (oldAgent.email != agent.email) {
            let otherAgent = await agentModel.findOne({email: req.body.email});
            if (otherAgent != null) {
                req.flash('error', ["Ya existe un agente con ese correo electrónico."])
                res.redirect('/agents');
            } else {
                let agentM = new agentModel(utilities.updateIfNecessary(oldAgent, agent));
                let error = agentM.validateSync();
                if (!error) {
                    // Connect to DB
                    let response = await agentM.save();
                    if (response === null) {
                        req.flash('error', ["El agente no se pudo editar correctamente."])
                        res.redirect('/agents');
                    } else {
                        req.flash('success', ["El agente se editó correctamente."])
                        res.redirect('/agents');
                    }
                } else {
                    let errorMsgs = utilities.getErrors(error.errors);
                    req.flash('error', errorMsgs)
                    res.redirect("/agents/edit/" + req.params.id);
                }
            }
        }
    });

    app.get('/agents/delete/:id', async function (req, res) {
        let condition = {"_id": mongoose.Types.ObjectId(req.params.id)};

        let response = await agentModel.deleteOne(condition);
        if (response === null) {
            req.flash('error', ["No se pudo eliminar el agente."]);
            res.redirect("/agents");
        } else {
            req.flash('success', ["Agente eliminado correctamente."]);
            res.redirect("/agents");
        }
    });
}
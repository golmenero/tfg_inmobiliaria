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
            req.flash('error', "Ocurrió un error al listar los agentes.")
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
        // Connect to DB
        let response = await agent.save(agent);
        if (response === null) {
            req.flash('error', "El agente no se pudo añadir correctamente.")
            res.redirect('/agents');
        } else {
            req.flash('success', "El agente se añadió correctamente.")
            res.redirect('/agents');
        }
    });

    app.get('/agents/edit/:id', async function (req, res) {
        let condition = {"_id": mongoose.Types.ObjectId(req.params.id)};
        let agent = await agentModel.findOne(condition);
        if (agent === null) {
            req.flash('error', "El agente no se pudo editar correctamente.")
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
        let agent = {}
        let condition = {"_id": mongoose.Types.ObjectId(req.params.id)};
        (req.body.name != "") ? agent["name"] = req.body.name : agent;
        (req.body.surname != "") ? agent["surname"] = req.body.surname : agent;
        (req.body.email != "") ? agent["email"] = req.body.email : agent;
        (req.body.password != "") ? agent["password"] = app.get("crypto").createHmac('sha256', app.get('key')).update(req.body.password).digest('hex') : agent;

        // Connect to DB
        let response = await agentModel.findOneAndUpdate(condition, agent);
        if (response === null) {
            req.flash('error', "El agente no se pudo editar correctamente.")
            res.redirect('/agents');
        } else {
            req.flash('success', "El agente se editó correctamente.")
            res.redirect('/agents');
        }
    });

    app.get('/agents/delete/:id', async function (req, res) {
        let condition = {"_id": mongoose.Types.ObjectId(req.params.id)};

        let response = await agentModel.deleteOne(condition);
        if (response === null) {
            req.flash('error', "No se pudo eliminar el agente.");
            res.redirect("/agents");
        } else {
            req.flash('success', "Agente eliminado correctamente.");
            res.redirect("/agents");
        }
    });
}
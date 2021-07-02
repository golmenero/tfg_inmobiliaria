// Modules
let express = require('express');
let app = express();

let fs = require('fs');
let https = require('https');
let flash = require('connect-flash')
let variables = require('./help/variables.js')
let utilities = require('./help/utilities.js')
let encrypter = require('./help/encrypter')

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

let fileUpload = require('express-fileupload');
app.use(fileUpload({}));

let nodemailer = require("nodemailer");

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Importante para extablecer conexión con la BD
require('./database/connection.js')

let render = require("./help/sessionRender.js");

let fileSystem = require('fs-extra');

// Cargar Los Routers Necesarios
require("./routers/routerUserSession")(app,express);
require("./routers/routerAgentSession")(app,express);
require("./routers/routerSuperAgentSession")(app,express);

// Establecer la carpeta "public" como estática
app.use(express.static('public'));

// Variables
app.set('port', variables.PORT)
app.set('url', variables.URL);
app.set('key', 'abcdefg');


let mongoose = require('mongoose')

// Rutas
require('./routes/users.js')(app, render, nodemailer, variables, utilities, mongoose, encrypter);
require('./routes/properties.js')(app, render, nodemailer, variables, utilities, fileSystem, mongoose);
require('./routes/system.js')(app, render, variables, utilities, mongoose);
require('./routes/wishes.js')(app, render, nodemailer, variables, utilities, mongoose);
require('./routes/conversations.js')(app, render, nodemailer, variables, utilities, mongoose);
require('./routes/agents.js')(app, render, nodemailer, variables, utilities, mongoose, encrypter);


app.get('/', function (req, res) {
    res.redirect('/home');
})

app.use(function (err, req, res, next) {
    console.log("Error producido: " + err);
    if (!res.headersSent) {
        res.status(400);
        res.send("Recurso no disponible");
    }
});


let userModel = require('./database/userModel');
let infoModel = require('./database/infoModel');

async function initParams() {
    let seguro = encrypter.encrypt("admin")
    let condition = {email: "charlygomezcolmenero@gmail.com"}
    let conditionInfo = {active: true}

    let resInfo = await infoModel.findOne(conditionInfo);
    let resUser = await userModel.findOne(condition);

    if (!resInfo) {
        let info = new infoModel({
            phones: variables.TELEFONOS,
            emails: variables.EMAILS,
            active: true
        });
        await info.save();
    }
    if (!resUser) {
        let user = new userModel({
            name: "Carlos",
            surname: "Gómez Colmenero",
            email: "charlygomezcolmenero@gmail.com",
            permission: 'S',
            password: seguro,
            active: true,
        });
        await user.save();
    }
}

let server = https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt'),
}, app);
server.listen(app.get('port'), async function () {
    await initParams();
    console.log("Servidor activo");
});

module.exports = server;
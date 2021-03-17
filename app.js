// Modules
let express = require('express');
let app = express();

let fs = require('fs');
let https = require('https');
let flash = require('connect-flash')
let variables = require('./variables.js')
let utilities = require('./utilities.js')

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

let crypto = require('crypto');

let fileUpload = require('express-fileupload');
app.use(fileUpload({}));

let nodemailer = require("nodemailer");

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Importante para extablecer conexión con la BD
require('./database/connection.js')

let render = require("./sessionRender.js");

let fileSystem = require('fs-extra');

let routerUserSession = express.Router();
routerUserSession.use(function (req, res, next) {
    if (req.session.user) {
        // dejamos correr la petición
        next();
    } else {
        res.redirect("/login");
    }
});

//Aplicar routerUsuarioSession
app.use("/properties/add", routerUserSession);
app.use("/user/edit", routerUserSession);
app.use("/user/delete", routerUserSession);
app.use("/user/edit/*", routerUserSession);
app.use("/user/delete/*", routerUserSession);
app.use("/myproperties", routerUserSession);
app.use("/wishes/*", routerUserSession);
app.use("/wishes", routerUserSession);
app.use("/agents", routerUserSession);
app.use("/agents/*", routerUserSession);
app.use("/info/*", routerUserSession);
app.use("/conversations", routerUserSession);
app.use("/conversations/*", routerUserSession);

app.use(express.static('public'));

// Variables
app.set('port', variables.PORT)
app.set('url', variables.URL);
//app.set('db', 'mongodb://admin:Pa55w0rd@tfginmobiliaria-shard-00-00.k8afj.mongodb.net:27017,tfginmobiliaria-shard-00-01.k8afj.mongodb.net:27017,tfginmobiliaria-shard-00-02.k8afj.mongodb.net:27017/dbinmobiliaria?ssl=true&replicaSet=atlas-39g3h2-shard-0&authSource=admin&retryWrites=true&w=majority')
app.set('key', 'abcdefg');
app.set('crypto', crypto);


let mongoose = require('mongoose')
// Rutas
require('./routes/users.js')(app,render, nodemailer,  variables, utilities, mongoose);
require('./routes/properties.js')(app,render, nodemailer,  variables, utilities, fileSystem, mongoose);
require('./routes/system.js')(app,render,  variables,utilities);
require('./routes/wishes.js')(app,render, nodemailer, variables,utilities, mongoose);
require('./routes/conversations.js')(app,render, nodemailer,  variables,mongoose);
require('./routes/agents.js')(app,render, nodemailer,  variables,utilities, mongoose);


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
    let seguro = app.get("crypto").createHmac('sha256', app.get('key')).update("admin").digest('hex');
    let condition = {email: "charlygomezcolmenero@gmail.com"}
    let conditionInfo = {active: true}
    let user = {
        name: "Carlos",
        surname: "Gómez Colmenero",
        email: "charlygomezcolmenero@gmail.com",
        permission: 'S',
        password: seguro,
        active: true,
    }
    let info = {
        phones: variables.TELEFONOS,
        emails: variables.EMAILS,
        active: true
    };

    await infoModel.findOneAndReplace(conditionInfo,info);
    await userModel.findOneAndReplace(condition, user);
}

https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), async function () {
    await initParams();
    console.log("Servidor activo");
});
// Modules
let express = require('express');
let app = express();

let fs =  require('fs');
let https = require('https');

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

let crypto = require('crypto');

let fileUpload = require('express-fileupload');
app.use(fileUpload());

let nodemailer = require("nodemailer");

let jsdom = require("jsdom");
let {JSDOM} = jsdom;
let {window} = new JSDOM();
let $ = require("jquery")(window);

let mongo = require('mongodb');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let managerDB = require("./modules/managerDB.js");
managerDB.init(app,mongo);

let render = require("./modules/sessionRender.js");

let routerUserSession = express.Router();
routerUserSession.use(function(req, res, next) {
    if ( req.session.user ) {
        // dejamos correr la petición
        next();
    } else {
        res.redirect("/login");
    }
});
//Aplicar routerUsuarioSession
app.use("/properties/add",routerUserSession);
app.use("/properties",routerUserSession);

let routerUserOwner = express.Router();
routerUserOwner.use(function(req, res, next) {
    let path = require('path');
    let id = path.basename(req.originalUrl);
    managerDB.getProperties(
        {_id: mongo.ObjectID(id) }, function (properties) {
            console.log(properties[0]);
            if(properties[0].owner == req.session.user ){
                next();
            } else {
                res.redirect("/properties");
            }
        })
});
//Aplicar routerUsuarioAutor
app.use("/property/edit",routerUserOwner);
app.use("/property/delete",routerUserOwner);


app.use(express.static('public'));

// Variables
app.set('port', 8081)
app.set('db', 'mongodb://admin:Pa55w0rd@tfginmobiliaria-shard-00-00.k8afj.mongodb.net:27017,tfginmobiliaria-shard-00-01.k8afj.mongodb.net:27017,tfginmobiliaria-shard-00-02.k8afj.mongodb.net:27017/dbinmobiliaria?ssl=true&replicaSet=atlas-39g3h2-shard-0&authSource=admin&retryWrites=true&w=majority')
app.set('key','abcdefg');
app.set('crypto',crypto);

// Rutas
require('./routes/users.js')(app,render, nodemailer, $, managerDB);
require('./routes/properties.js')(app,render, nodemailer, $, managerDB);

app.get('/', function (req, res) {
    res.redirect('/properties');
})

app.use(function(err,req,res,next){
    console.log("Error producido: " + err);
    if(!res.headersSent){
        res.status(400);
        res.send("Recurso no disponible");
    }
});

https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), function() {
    console.log("Servidor activo");
});
// Modules
let express = require('express');
let app = express();

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

let crypto = require('crypto');

let fileUpload = require('express-fileupload');
app.use(fileUpload());

let mongo = require('mongodb');
let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let managerDB = require("./modules/managerDB.js");
managerDB.init(app,mongo);


let routerUserSession = express.Router();
routerUserSession.use(function(req, res, next) {
    console.log("routerUserSession");
    if ( req.session.user ) {
        // dejamos correr la petición
        next();
    } else {
        console.log("va a : "+req.session.destino)
        res.redirect("/login");
    }
});
//Aplicar routerUsuarioSession
app.use("/properties/add",routerUserSession);
app.use("/properties",routerUserSession);

let routerUserOwner = express.Router();
routerUserOwner.use(function(req, res, next) {
    console.log("routerUserOwner");
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
require('./routes/users.js')(app,swig, managerDB);
require('./routes/properties.js')(app,swig, managerDB);

app.get('/', function (req, res) {
    res.redirect('/properties');
})

app.listen(app.get('port'), function () {
    console.log('Servidor Activo')
});
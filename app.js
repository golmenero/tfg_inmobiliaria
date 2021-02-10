// Modules
let express = require('express');
let app = express();

let fileUpload = require('express-fileupload');
app.use(fileUpload());

let mongo = require('mongodb');
let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

let managerDB = require("./modules/managerDB.js");
managerDB.init(app,mongo);

// Variables
app.set('port', 8081)
app.set('db', 'mongodb://admin:Pa55w0rd@tfginmobiliaria-shard-00-00.k8afj.mongodb.net:27017,tfginmobiliaria-shard-00-01.k8afj.mongodb.net:27017,tfginmobiliaria-shard-00-02.k8afj.mongodb.net:27017/dbinmobiliaria?ssl=true&replicaSet=atlas-39g3h2-shard-0&authSource=admin&retryWrites=true&w=majority')

// Rutas
require('./routes/users.js')(app,swig, managerDB);
require('./routes/properties.js')(app,swig, managerDB);

app.listen(app.get('port'), function () {
    console.log('Servidor Activo')
});
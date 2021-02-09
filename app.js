// Modules
let express = require('express');
let app = express();

let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

// Variables
app.set('port', 8081)

// Rutas
require('./rutas/users.js')(app,swig);
require('./rutas/properties.js')(app,swig);

app.listen(app.get('port'), function () {
    console.log('Servidor Activo')
});
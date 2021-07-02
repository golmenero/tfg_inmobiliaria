let mongoose = require('mongoose');
let variables = require('../help/variables');
let db = mongoose.connection;

mongoose.connect(variables.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).catch(err => console.log(err));

db.once('open', _ => {
    console.log("Conexión establecida.")
})
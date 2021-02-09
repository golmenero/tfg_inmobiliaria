module.exports = function (app, swig) {
    app.get('/properties', function (req, res) {
        let properties = [{
            "name": "Chalet 1",
            "price": "10000"
        }, {
            "name": "Chalet 2",
            "price": "20000"
        }, {
            "name": "Chalet 3",
            "price": "30000"
        }];

        let response = swig.renderFile('views/tienda.html', {
            seller: 'Agencia inmobiliaria',
            properties: properties
        });

        res.send(response);
    });

    app.get('/properties/:id', function (req, res) {
        let response = 'id: ' + req.params.id;
        res.send(response);
    });

    app.get('/properties/:type/:id', function (req, res) {
        let response = 'id: ' + req.params.id + '<br>' + 'Género: ' + req.params.type;
        res.send(response);
    });

    app.post('/properties', function (req, res) {
        res.send("Propiedad añadida: " + req.body.name + '<br>'
            + ' tipo: ' + req.body.type + '<br>' + ' precio: ' + req.body.price);
    })
}
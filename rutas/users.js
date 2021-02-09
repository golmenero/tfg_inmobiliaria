module.exports = function (app,swig) {
    app.get("/rutas", function (req, res) {
        res.send("ver usuarios");
    });
};
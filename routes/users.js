module.exports = function (app,swig, managerDB) {
    app.get("/routes", function (req, res) {
        res.send("ver usuarios");
    });
};
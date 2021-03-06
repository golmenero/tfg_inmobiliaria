module.exports = function (app, render, variables) {
    app.get("/info", function (req, res) {
        let respuesta = render(req.session, 'views/info.html', {
            user: req.session.user,
            error: req.flash('error'),
            success: req.flash('success')
        });
        res.send(respuesta);
    });
}
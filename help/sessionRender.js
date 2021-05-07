let swig = require('swig');
module.exports =
    /**
     * Funcion que utiliza el módulo render para cargar la pantalla.
     * session -> La sesión de usuario actual.
     * file -> El archivo que se desea cargar.
     * args -> Otros posibles objetos que deseen enviarse a la interfaz.
     */
    function render (session, file, args){
    args['user'] = session.user;
    args['userId'] = session.userId;
    let response = swig.renderFile(file,args);
    return response;
};
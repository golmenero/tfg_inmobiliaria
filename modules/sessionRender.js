let swig = require('swig');
module.exports = function render (session, file, args){
    args['user'] = session.user;
    let response = swig.renderFile(file,args);
    return response;
};
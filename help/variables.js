module.exports = {
    HOST: 'https://localhost:8081',
    PORT : (process.env.PORT || 8081),
    //URL : 'mongodb://127.0.0.1:27017/tfginmobiliaria',
    URL: 'mongodb://admin:Pa55w0rd@tfginmobiliaria-shard-00-00.k8afj.mongodb.net:27017,tfginmobiliaria-shard-00-01.k8afj.mongodb.net:27017,tfginmobiliaria-shard-00-02.k8afj.mongodb.net:27017/dbinmobiliaria?ssl=true&replicaSet=atlas-39g3h2-shard-0&authSource=admin&retryWrites=true&w=majority',
    // Email de atencion al cliente. El que recibirá los mensajes
    EMAILAGENTCONVERSATION: "charlygomezcolmenero@gmail.com",
    // Email y contraseña del correo encargado de enviar los mensajes tanto de recuperar la contraseña como de confirmar correo
    EMAILVERIF: 'tfguo257386@gmail.com',
    PASSVERIF: "TFG_UO257386",
    IMGFOLDER: "public/propertiesimg",
    TELEFONOS: "+34 985 470 012",
    EMAILS: "info@arca-agenciainmobiliaria.com",

};
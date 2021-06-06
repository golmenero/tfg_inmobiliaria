const crypto = require("crypto");
const key = "12345678123456781234567812345678";

module.exports = {
    /**
     * Método para encriptar textos
     * text -> El valor del texto.
     */
    encrypt: function (text) {
        const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
        const encrypter = crypto.createCipheriv("aes-256-cbc", key, iv);
        let encryptedMsg = encrypter.update(text, "utf-8", "hex");
        encryptedMsg += encrypter.final("hex");

        return {
            iv: iv,
            data: encryptedMsg
        };
    },
    /**
     * Método para encriptar textos, cn un IV predeterminado
     * text -> El valor del texto.
     * iv -> El codigo de codificacion almacenado en el usuario
     */
    encryptIV: function (text, newIV) {
        const encrypter = crypto.createCipheriv("aes-256-cbc", key, newIV);
        let encryptedMsg = encrypter.update(text, "utf-8", "hex");
        encryptedMsg += encrypter.final("hex");
        return {
            iv: newIV,
            data: encryptedMsg
        };
    },
    /**
     * Método para encriptar textos
     * text -> El valor del texto.
     * iv -> El codigo de codificacion almacenado en el usuario
     */
    decrypt: function (text, newIV){
        const decrypter = crypto.createDecipheriv("aes-256-cbc", key, newIV);
        let decryptedMsg = decrypter.update(text, "hex", "utf8");
        decryptedMsg += decrypter.final("utf8");

        return decryptedMsg;
    }
}
// Testing Tools
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')

chai.should();
chai.use(chaiHttp);

// Database
let mongoose = require('mongoose');
let agentModel = require('../database/agentModel');

// Utils
let fs = require('fs');

describe("Tests agents.js", () => {

    before(() => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    })

    /**
     * Probar la llamada GET de /agents
     */
    describe('GET /agents', () => {
        it("Deberia obtener todos los agentes", (done) => {
            chai.request(server)
                .get("/agents")
                .end((err, response) => {
                    console.log(response);
                    done();
                })
        })
    })

})

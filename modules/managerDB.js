module.exports = {
    mongo: null, app: null, init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    }, addProperty: function (property, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('properties');
                collection.insert(property, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    }, getProperties: function (condition, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('properties');
                collection.find(condition).toArray(function (err, properties) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(properties);
                    }
                    db.close();
                });
            }
        });
    }
};
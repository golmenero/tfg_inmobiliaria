module.exports = {
    mongo: null, app: null, init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    }, getPG: function (condition, collectionName, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('url'), function (err, client) {
            if (err) {
                funcionCallback(null);
            } else {
                let db = client.db('tfginmobiliaria');
                let collection = db.collection(collectionName);
                collection.count(function (err, count) {
                    collection.find(condition).skip((pg - 1) * 4).limit(4)
                        .toArray(function (err, properties) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(properties, count);
                            }
                            db.close();
                        });
                });
            }
        });
    }, add: function (object, collectionName, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('url'), function (err, client) {
            if (err) {
                funcionCallback(null);
            } else {
                let db = client.db('tfginmobiliaria');
                let collection = db.collection(collectionName);
                collection.insert(object, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    }, delete: function (object, collectionName, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('url'), function (err, client) {
            if (err) {
                funcionCallback(null);
            } else {
                let db = client.db('tfginmobiliaria');
                let collection = db.collection(collectionName);
                collection.remove(object, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    }, edit: function (condition, object, collectionName, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('url'), function (err, client) {
            if (err) {
                funcionCallback(null);
            } else {
                let db = client.db('tfginmobiliaria');
                let collection = db.collection(collectionName);
                collection.update(condition, {$set: object}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    }, get: function (condition, collectionName, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('url'), function (err, client) {
            if (err) {
                funcionCallback(null);
            } else {
                let db = client.db('tfginmobiliaria');
                let collection = db.collection(collectionName);
                collection.find(condition).toArray(function (err, array) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(array);
                    }
                    db.close();
                });
            }
        });
    },  pushWish: function (condition, idWish, collectionName, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('url'), function (err, client) {
            if (err) {
                funcionCallback(null);
            } else {
                let db = client.db('tfginmobiliaria');
                let collection = db.collection(collectionName);
                collection.update(condition, {$push: { wishes: idWish}}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },  pullWish: function (condition, idWish, collectionName, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('url'), function (err, client) {
            if (err) {
                funcionCallback(null);
            } else {
                let db = client.db('tfginmobiliaria');
                let collection = db.collection(collectionName);
                collection.update(condition, {$pull: { wishes: idWish}}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
};
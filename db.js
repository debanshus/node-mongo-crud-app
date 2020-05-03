let mongodb = require('mongodb')
let client = mongodb.MongoClient;
let collection;

function connect() {
    client.connect('mongodb://localhost:27017', {useUnifiedTopology: true}, function (er, mongoClient) {
        if (!er) {
            console.log('mongodb is connected.')
        }
        let db = mongoClient.db('asset-manager');
        collection = create(db)
    });
}

function create(db) {
    db.createCollection('assets', {w: 1}, function (err, collection) {
        if (err) console.log(err);
        else console.log('collection assets created');
    });
    return db.collection('assets');
}

function insert(data) {
    collection.insertOne(data, {w: 1}, function (error, result) {
        if (error) console.log('failed to insert data in mongodb');
        else console.log('successfully inserted data in mongodb');
    });
}

function updateById(id, dataToUpdate) {
    console.log(id, JSON.stringify(dataToUpdate));
    collection.updateOne({'_id': new mongodb.ObjectID(id)}, {$set: dataToUpdate}, {w: 1}, function (error, result) {
        if (error) console.log('failed to update data in mongodb');
        else console.log('successfully update data in mongodb');
    });
}

function removeById(id) {
    collection.deleteOne({'_id': new mongodb.ObjectID(id)}, {w: 1}, function (error, result) {
        if (error) console.log('failed to delete data in mongodb');
        else console.log('successfully delete data in mongodb');
    });
}

function query(callback) {
    let stream = collection.find().stream();
    let assets = [];
    stream.on('data', function (data) {
        assets.push(data);
    });

    stream.on('end', function (error, data) {
        callback(assets);
    });
}

module.exports = {
    connect: connect,
    insert: insert,
    updateById: updateById,
    removeById: removeById,
    query: query
};
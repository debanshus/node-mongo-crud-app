let express = require('express');
let bodyParser = require('body-parser');
let mongo = require('./db.js')
let app = express()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);

let server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    mongo.connect();
    console.log("express JS app is listening to http://%s:%s", host, port);
});

app.get('/', function (request, response) {
    mongo.query(function (assets) {
        response.render('index.html', {"assets": JSON.stringify(assets)});
    });
});

app.post('/', function (request, response) {
    mongo.insert({brand: request.body['brand'], type: request.body['type'], serial: request.body['serial']})
    mongo.query(function (assets) {
        response.send(assets);
    });
});

app.put('/', function (request, response) {
    mongo.updateById(request.body.id, {
        brand: request.body['brand'],
        type: request.body['type'],
        serial: request.body['serial']
    })
    mongo.query(function (assets) {
        response.send(assets);
    });
});

app.delete('/', function (request, response) {
    mongo.removeById(request.body.id);
    mongo.query(function (assets) {
        response.send(assets);
    });
});
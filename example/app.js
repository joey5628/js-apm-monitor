var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    if(req.method=="OPTIONS") res.sendStatus(200); 
    else  next();
});

app.post('/log', function(req, res) {
    var body = req.body;
    try {
        var fd = fs.openSync('example/log.txt', 'a+');
        fs.appendFileSync(fd, JSON.stringify(body) + '\r\n\r\n');
        res.send({message: '成功', code: 0});
    } catch (err) {
        /* Handle the error */
        res.send({message: '失败', error: err, code: 1});
    }
});

app.use(express.static(__dirname + '/public'));


app.listen(3000, function() {
    console.log(`http://127.0.0.1:3000`);
});

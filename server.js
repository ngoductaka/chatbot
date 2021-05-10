const APP_SECRET = '2065a9ef991d5f3743c6ff4885ceb3a1';
const VALIDATION_TOKEN = 'TokenTuyChon';
const PAGE_ACCESS_TOKEN = 'EAALuerCFvAsBANaiNJtxZBsX0VQbHLfnHz8Cnz5ancvmZBDrbltsn4ilgxXg68ZCbQhfWK0uCceT2OtV1rF05muKdcZCe4LJ00ZCO77YhZBL2sZAZAD8KKbjQwatg3uZA3ybxCwISaLO7ok60HvwJzxrrrduCMckcryIze596EP4bZC8mOyO6aQ9sz';

var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
var server = http.createServer(app);
var request = require("request");

app.get('/', (req, res) => {
    res.send("Home page.dnd Server running okay.");
});

app.get('/webhook', function (req, res) { // Đây là path để validate tooken bên app facebook gửi qua
    if (req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        console.log(12345)
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

app.post('/webhook', function (req, res) { // Phần sử lý tin nhắn của người dùng gửi đến
    var entries = req.body.entry;
    console.log('entries', entries)
    for (var entry of entries) {
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id;
            if (message.message) {
                if (message.message.text) {
                    var text = message.message.text;
                    sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
                }
            }
        }
    }
    res.status(200).send("OK");
});

// Đây là function dùng api của facebook để gửi tin nhắn
function sendMessage(senderId, message) {
    console.log('senderId, message', senderId, message)
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: PAGE_ACCESS_TOKEN,
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: message
            },
        }
    });
}

app.set('port', process.env.PORT || 5111);
app.set('ip', process.env.IP || "0.0.0.0");

server.listen(app.get('port'), app.get('ip'), function () {
    console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});
const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const session = require('express-session');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(session({secret: 'anything-you-want-but-keep-secret'}));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
    let randomWord = "";

    axios.get('https://random-word-api.herokuapp.com/word?number=1&swear=0')
    .then(response => {
        randomWord = response.data[0];
        console.log(randomWord);

        console.log(req.body.Body);

        const smsCount = req.session.counter || 0; //used to count how many times someone has played

        const twiml = new MessagingResponse();

        let message = "Hello, thanks for messaging this number for the first time. Your word is " + randomWord 

        if (smsCount > 0) {
            message = 'Hello Adam, thanks for message number ' + (smsCount + 1) + ". Your word is " + randomWord;
        }

        req.session.counter = smsCount + 1;

        twiml.message(message);
        // message.media('https://farm8.staticflickr.com/7090/6941316406_80b4d6d50e_z_d.jpg'); //used to add a picture

        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    })
    .catch(error => {
        console.log(error);
    });

    
});

http.createServer(app).listen(1337, () => {
    console.log('Express server listening on port 1337');
});

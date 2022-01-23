const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const session = require('express-session');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(session({secret: 'anything-you-want-but-keep-secret'}));
app.use(bodyParser.urlencoded({ extended: false }));

const winCheck = (xString) => {
    for (let i = 0; i < xString.length; i++) {
        if (xString.charAt(i) === "_") {
            return false;
        }
    }

    return true;
}

const createXString = (wordLength) => {
    let xString = "";

    for (let i = 0; i < wordLength; i++) {
        xString += "_";
    }

    console.log(xString);
    return xString
}

const createWordArray = (word) => {
    const wordArray = [];

    for (let i = 0; i < word.length; i++) {
        wordArray[i] = word.charAt(i);
    }

    console.log(wordArray);
    return wordArray;
}

const updateWordArray = (letter, wordArray) => {
    for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i] === letter) {
            wordArray[i] = "+";  
        }
    }

    return wordArray;
}

const updateXString = (letter, xString, wordArray) => {
    let newXString = "";
    for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i] === letter) { 
            newXString += letter;

        } else {
            newXString += xString.charAt(i);
        }
    }

    console.log("new xString: " + newXString);
    return newXString;
}

let wordArray = []
let xString = "";
let guessesLeft = 5;
let randomWord = "";

app.post('/sms', (req, res) => {
    let incomingText = req.body.Body;
    console.log(incomingText);
    let outgoingMessage = "" 
    const smsCount = req.session.counter || 0; //used to count how many times someone has played


    if (incomingText === "PLAY" || incomingText === "play" || incomingText === "Play") {
        console.log("Starting new game");
        axios.get('https://random-word-api.herokuapp.com/word?number=1&swear=0')
        .then(response => {
            randomWord = response.data[0]; // random word generated by the API
            console.log(randomWord);

            xString = createXString(randomWord.length)
            outgoingMessage = "Your word is " + xString
            console.log(outgoingMessage);

            wordArray = createWordArray(randomWord);
        })
        .catch(error => {
            console.log(error);
        }); 

    } else if (incomingText.length === 1 && smsCount > 0) {
        console.log("incoming guess");

        let incomingLowerCaseText = incomingText.toLowerCase().trim();
        console.log(incomingLowerCaseText);
        console.log(wordArray);
        console.log(wordArray.includes(incomingLowerCaseText));

        if (wordArray.includes(incomingLowerCaseText)) {

            xString = updateXString(incomingLowerCaseText, xString, wordArray)
            wordArray = updateWordArray(incomingLowerCaseText, wordArray)

            if (winCheck(xString)) {
                outgoingMessage = "Congrats you won! Type PLAY to play again"
                
            } else {
                outgoingMessage = "Good guess! " + xString
            }

        } else {
            guessesLeft--;

            if (guessesLeft == 0) {
                outgoingMessage = "Sorry you have no guesses left. Type PLAY to try again"

            } else {
                outgoingMessage = "Nope, you have " + guessesLeft + " guesses left"
            }
        }
    
    } else {
        console.log("random");

        if (smsCount > 0) {
            outgoingMessage = "Welcome back, type PLAY to begin"

        } else {
            outgoingMessage = "Welcome new player, type PLAY to begin" 
        }

        req.session.counter = smsCount + 1;
    }

    setTimeout(() => {
        const twiml = new MessagingResponse();
        console.log(outgoingMessage);

        twiml.message(outgoingMessage);
        // message.media('https://farm8.staticflickr.com/7090/6941316406_80b4d6d50e_z_d.jpg'); //used to add a picture
    
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    }, 600)
    
});

http.createServer(app).listen(1337, () => {
    console.log('Express server listening on port 1337');
});

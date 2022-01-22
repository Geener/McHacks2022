// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = "AC0cc3256161ea3a8329cbd721e9f38b7f";
const authToken = "2997c232e961810ab87ccec15e1f1774";
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'Hello sir, Is this working?>?',
        from: '+16203178894',
        to: '+15144529399'
    })
    .then(message => console.log(message.sid));
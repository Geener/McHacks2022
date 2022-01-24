// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = "AC9b039c0188c27ee9ac955c3c3dae7f62";
const authToken = "06ab32add69e99923cfc1bbff0f41b4c";
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'Hello sir, Is this working?>?',
        from: '+16203178894',
        to: '+15144529399'
    })
    .then(message => console.log(message.sid));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const enviarWhats = (mensaje, destino) => {
  client.messages
        .create({
           from: 'whatsapp:+14155238886',
           body: mensaje,
           to: `whatsapp:${destino}`
         })
        .then(message => console.log(message.sid))
        .catch(err => console.error(err));
}

module.exports = { enviarWhats }
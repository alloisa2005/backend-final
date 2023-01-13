
require('dotenv').config();
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  tls: { rejectUnauthorized: false },  // tuve que agregar esta propiedad, sino no me funcionaba
  auth: {
    user: process.env.MAIL_NODEMAILER,
    pass: process.env.PASS_NODEMAILER
  }
})

const enviarMail = (destino, asunto, mensaje) => {
  const mailOptions = {
    from: process.env.MAIL_NODEMAILER,
    to: destino,
    subject: asunto,
    html: mensaje
  }

  transporter.sendMail(mailOptions)
    .then(info => console.log(info))
    .catch(err => console.log(err));
}

module.exports = {enviarMail}
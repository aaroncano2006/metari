// require('dotenv').config({
//   path: require('path').resolve(__dirname, '../../.env')
// });
require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: process.env.TRANSPORTER_SERVICE || "gmail",
    auth: {
        user: process.env.TRANSPORTER_USER,
        pass: process.env.TRANSPORTER_APP_PASS
    },
});

module.exports = transporter;
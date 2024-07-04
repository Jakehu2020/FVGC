// amwxshhhazeulija
const nodemailer = require('nodemailer');
const fs = require("fs");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "futurevoicesgc@gmail.com",             // Your Gmail address from the .env file 
        pass: "amwxshhhazeulija",             // Your Gmail app password from the .env file
    }
});

function send(to, subject, html) {
    transporter.sendMail({
        from: "futurevoicesgc@gmail.com",
        to, subject, html
    }, function (error, info) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent: ', info.response);
        }
    });
}

function getEmailHTML(file) {
    return fs.readFileSync("./emails/" + file + ".html");
}

module.exports = { send, getEmailHTML }
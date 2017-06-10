const mailer = require('feathers-mailer');

var smtpConfig = {
    service: 'gmail',
    port: 465,
    secure: false,
    auth: {
        user: 'vacster.spam@gmail.com',
        pass: 'vacster123'
    }
};

var mail_sender = mailer(smtpConfig);

exports.mailer = mail_sender;

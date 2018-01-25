var ses = require('nodemailer-ses-transport');
var path = require('path');
var ses = require('node-ses')
var client = ses.createClient({ key: '', secret: '' });

class EmailService {
    _sendEmail(from, to, subject, html) {
        return new Promise((resolve, reject) => {
            client.sendEmail({
                bcc: to
             , from: `${from}@example.com.br`
             , subject: subject
             , message: html
            }, function (err, data, res) {
                err ? reject(err) : resolve(data)
            });
        });
    };
}

module.exports = EmailService;

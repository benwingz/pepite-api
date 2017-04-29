var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'benjamin.roullet@skilvioo.net',
        pass: 'skilvioo2017RS'
    }
});

// setup email data with unicode symbols
var mailOptions = {
    from: '"Pepite" <noreply@pepite.com>', // sender address
};

exports.mailtoActivate = function(user, subject, token) {

  mailOptions.to = user.email, // list of receivers
  mailOptions.subject = subject, // Subject line
  mailOptions.html =  generateContent(token)// html body

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

function generateContent(token) {
  var url = ((process.env.ENV == 'DEV') ? 'http://localhost:4200': 'http://pepite.skilvioo.com') + '/activate/' + token;
  var mailContent = 'Voici le lien pour activer votre compte : <a href="' + url + '">Cliquez ici</a>';
  return mailContent;
}

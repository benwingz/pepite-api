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
    from: '"Pepite" <pepite@skilvioo.com>', // sender address
};

exports.mailtoActivate = function(user, subject, token) {

  mailOptions.to = user.email, // list of receivers
  mailOptions.subject = subject, // Subject line
  mailOptions.html = generateContent(
    `<p>Bonjour,</p>
     <p>Bienvenue sur votre plateforme d’évaluation de compétences PEPITE SKILLS,</p>
     <p>Afin d’activer votre compte, merci de suivre ce lien :</p>`,
    token,
    '/activate/')// html body

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

exports.mailtoResetPassword = function(user, subject, token) {
  mailOptions.to = user.email, // list of receivers
  mailOptions.subject = subject, // Subject line
  mailOptions.html = generateContent(
    `<p>Bonjour,</p>
     <p>Afin de réinitialiser votre mot de passe pour accéder à la plateforme PEPITE SKILLS,  merci de suivre ce lien :</p>`,
    token,
    '/reset/');
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

function generateContent(content, token, url) {
  var url = ((process.env.ENV == 'DEV') ? 'http://localhost:4200': 'http://pepite.skilvioo.com') + url + token;
  console.log('url:', url);
  var mailContent = content + '<p><a href="' + url + '">Cliquez ici</a></p><p>Bien cordialement</p><p>Pépite France</p>';
  console.log(mailContent);
  return mailContent;
}

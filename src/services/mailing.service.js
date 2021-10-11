const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const ejs = require('ejs');
const logger = require('fancy-log');
require('dotenv').config();

const oauth2Client = new OAuth2(
  process.env.CLIENTID,
  process.env.CLIENTSECRET,
  'https://developers.google.com/oauthplayground', // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESHTOKEN,
});
const accessToken = oauth2Client.getAccessToken();

const renderEjs = async (data) => {
  return ejs.renderFile(__dirname + '/../../assets/email_templates/email.ejs', {
    data: data,
  });
};

const send = async (emailData, cb) => {
  var sucArr = [];
  var errArr = [];

  let transporter = nodemailer.createTransport({
    pool: true,
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'noreply.codenection@gmail.com',
      clientId: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      refreshToken: process.env.REFRESHTOKEN,
      accessToken: accessToken,
    },
    debug: true,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const sendEmail = async (options, cb) => {
    transporter.sendMail(options, (err, info) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, 'Email sent: ' + info.response);
      }
    });
  };

  emailData.forEach(async (emailObj, idx) => {
    let mailOptions = {
      from: 'noreply.codenection@gmail.com',
      to: emailObj.to,
      subject: 'codenection 2021',
      html: '<h1>hello world</h1>',
      attachments: [
        {
          filename: 'splash.img',
          path: __dirname + '/../../assets/email_templates/img/splash.png',
          cid: 'splash',
        },
        {
          filename: 'codenection.img',
          path: __dirname + '/../../assets/email_templates/img/codenection.png',
          cid: 'codenection',
        },
        {
          filename: 'codenection-color.img',
          path:
            __dirname +
            '/../../assets/email_templates/img/codenection-color.png',
          cid: 'codenection-color',
        },
        {
          filename: 'facebook.img',
          path: __dirname + '/../../assets/email_templates/img/facebook.png',
          cid: 'facebook',
        },
        {
          filename: 'insta.img',
          path: __dirname + '/../../assets/email_templates/img/insta.png',
          cid: 'insta',
        },
        {
          filename: 'mail.img',
          path: __dirname + '/../../assets/email_templates/img/mail.png',
          cid: 'mail',
        },
        {
          filename: 'link.img',
          path: __dirname + '/../../assets/email_templates/img/link.png',
          cid: 'link',
        },
        {
          filename: 'its.img',
          path: __dirname + '/../../assets/email_templates/img/its.png',
          cid: 'its',
        },
      ],
    };
    let htmlData = await renderEjs(emailObj.data);
    if (htmlData) {
      mailOptions.html = htmlData;
    } else {
      logger.error('error in rendering ejs');
    }
    await sendEmail(mailOptions, (err, info) => {
      if (err) {
        logger.error('Email sending error' + err);
        errArr.push(err);
      } else {
        sucArr.push({
          recipient: emailObj.to,
          message: info,
        });
      }

      if (idx === emailData.length - 1) {
        transporter.close();
        cb(null, {
          sucArr,
          errArr,
        });
      }
    });
  });

  transporter.on('idle', () => {
    transporter.close;
  });
};

module.exports = {
  send,
};

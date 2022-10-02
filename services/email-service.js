const nodemailer = require('nodemailer');


const sendEmail = (receiver, subject, text) => {
    // TODO: send email logic
    
    var transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',                  // hostname
        service: "hotmail",                             // service name
        secureConnection: false,
        tls: {
            ciphers: 'SSLv3'                            // tls version
        },
        port: 587,                                      // SMTP port
        auth: {
          user: process.env.EMAIL_ADDRESS,              // email address
          pass: process.env.EMAIL_PASSWORD              // email password
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: receiver,
        subject: subject,
        text: text
    };
      
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);
      else console.log('Email sent: ' + info.response);
    }); 
}

module.exports = { sendEmail }
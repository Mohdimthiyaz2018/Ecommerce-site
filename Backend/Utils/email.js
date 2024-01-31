const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
    var transport = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 587,
        auth: {
          user: "53799eec2e6b36",
          pass: "73016d7b534979"
        }
      });

      const message = {
        from: 'CONGO <mohamedimthiyaz074@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
      }

    await transport.sendMail(message);
}

module.exports = sendEmail;
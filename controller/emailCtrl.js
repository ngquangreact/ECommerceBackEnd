const asyncHandler = require("express-async-handler");
const nodeMailer = require("nodemailer");

const sendEmail = asyncHandler(async(data,req,res) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.MAIL_ID,
          pass: process.env.MP,
        },
      });
      
    // send mail with defined transport object
    async function main() {
      const info = await transporter.sendMail({
          from: 'Hey 👻"nguyen.quang24799@gmail.com"', // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.html, // html body
      });
      
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
      //
      // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
      //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
      //       <https://github.com/forwardemail/preview-email>
      //
    }
    main().catch(console.error);
});

module.exports = sendEmail;
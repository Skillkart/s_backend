const nodemailer = require("nodemailer");
const ejs = require("ejs");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(verifycode, username, email) {
    this.verifycode = verifycode;
    this.username = username;
    this.email = email;
  }
  mailtransporter() {
    return nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 587,
      auth: {
        user: "info@skillkart.app",
        pass: "Ashwani@1",
      },
    });
  }
  async send() {
    console.log(this.verifycode);
    const html = await ejs.renderFile(
      `${__dirname}/../views/Popup/WelcomUser.ejs`,
      {
        verifycode: this.verifycode,
        username: this.username,
      }
    );

    let detail = {
      from: "info@skillkart.app",
      to: this.email,
      subject: "Welcome To Skillkart Family",
      html,
      text: htmlToText.compile(html),
    };
    await this.mailtransporter().sendMail(detail, (error, info) => {
      console.log(error);
      console.log(info);
    });
  }
};

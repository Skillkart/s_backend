const nodemailer = require("nodemailer");
const ejs = require("ejs");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(verifycode, username, email, temp) {
    this.verifycode = verifycode;
    this.username = username;
    this.email = email;
    this.temp = temp;
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
  async welcomesend() {
    const html = await ejs.renderFile(
      `${__dirname}/../views/Popup/WelcomUser.ejs`,
      {
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
  async send() {
    const html = await ejs.renderFile(
      `${__dirname}/../views/Popup/VerifyEmail.ejs`,
      {
        verifycode: this.verifycode,
        username: this.username,
      }
    );

    let detail = {
      from: "info@skillkart.app",
      to: this.email,
      subject: "Login verification",
      html,
      text: htmlToText.compile(html),
    };
    await this.mailtransporter().sendMail(detail, (error, info) => {
      console.log(error);
      console.log(info);
    });
  }
};

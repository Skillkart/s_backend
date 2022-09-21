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
  async passwordreset() {
    const html = await ejs.renderFile(
      `${__dirname}/../views/Popup/Passwordreset.ejs`,
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
  async welcomesend() {
    const html = await ejs.renderFile(
      `${__dirname}/../views/Popup/WelcomeUser.ejs`,
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
  async welcomementor() {
    const html = await ejs.renderFile(
      `${__dirname}/../views/Popup/Welcomementor.ejs`,
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

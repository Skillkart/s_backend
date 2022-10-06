const nodemailer = require("nodemailer");
const ejs = require("ejs");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(verifycode, username, email, temp, productid, referername) {
    this.verifycode = verifycode;
    this.username = username;
    this.email = email;
    this.temp = temp;
    this.productid = productid;
    this.referername = referername;
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
      `${__dirname}/../views/Popupref/Passwordreset.ejs`,
      {
        verifycode: this.verifycode,
        username: this.username,
      }
    );

    let detail = {
      from: "info@skillkart.app",
      to: this.email,
      subject: "Purchase completed ",
      html,
      text: htmlToText.compile(html),
    };
    await this.mailtransporter().sendMail(detail, (error, info) => {
      console.log(error);
      console.log(info);
    });
  }
  async purchase() {
    const html = await ejs.renderFile(
      `${__dirname}/../views/Popup/Coursepurchase.ejs`,
      {
        username: this.username,
        productid: this.productid,
      }
    );

    let detail = {
      from: "info@skillkart.app",
      to: this.email,
      subject: "Now Be job ready in 30 days",
      html,
      text: htmlToText.compile(html),
    };
    await this.mailtransporter().sendMail(detail, (error, info) => {
      console.log(error);
      console.log(info);
    });
  }
  async referalprogram() {
    const html = await ejs.renderFile(
      `${__dirname}/../views/Popup/Referalprogram.ejs`,
      {
        username: this.username,
        referername: this.referername,
      }
    );

    let detail = {
      from: "info@skillkart.app",
      to: this.email,
      subject: "Now Be job ready in 30 days",
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

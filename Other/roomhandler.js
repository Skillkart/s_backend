const nodemailer = require("nodemailer");
const ejs = require("ejs");
const htmlToText = require("html-to-text");

module.exports = class RoomEmail {
  constructor(
    url,username, email, time, date) {
    this.url = url;
    this.username = username;
    this.email = email;
    (this.time = time), (this.date = date);
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
    const html = await ejs.renderFile(
      `${__dirname}/../views/Popup/Roomcreation.ejs`,
      {
        url: this.url,
        username: this.username,
      }
    );

    let detail = {
      from: "info@skillkart.app",
      to: this.email,
      subject: "[Room creation]",
      html,
      text: htmlToText.compile(html),
    };
    await this.mailtransporter().sendMail(detail, (error, info) => {
      console.log(error);
      console.log(info);
    });
  }
};

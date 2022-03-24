const nodemailer = require('nodemailer');
const pug = require('pug')
const { htmlToText }= require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
      this.from = `Altum <${process.env.EMAIL_FROM}>`;
      this.firstName = user.name.split(' ')[0];
        this.to = user.email;
        this.url = url;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
          // nodemailer
          return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD
            }
          });
  
        }
      }
    // Send the actual email
    async send(template, subject) {
        
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,
        {
            firstName: this.firstName,
            url: this.url,
            subject
        });
        // 1) Render html based on a pug template U NAS TRZXEBA REACTA renderowac
           // 2) Define the email options
    const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html)
    };
    // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Witamy w aplikacji Altum.');
    }
    
    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Token dla zresetowania twojego hasła (dostępny przez 10 minut)'
            )
        }
    };


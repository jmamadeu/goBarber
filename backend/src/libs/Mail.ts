import nodemailer from 'nodemailer';

import mailConfig from '../configs/mail';

const { host, port, secure, auth } = mailConfig;

class Mail {
  static transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: auth.user ? auth : null,
  });

  static sendMail(message: object) {
    return this.transporter
      .sendMail({ ...mailConfig.default, ...message })
      .then(() => {})
      .catch((err) => console.log('erro mail', err));
  }
}

export default Mail;

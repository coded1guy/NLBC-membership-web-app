import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);
oAuth2Client.setCredentials({ refresh_token: process.env.EMAIL_REFRESH_TOKEN });

const createTransporter = async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER_EMAIL,
        accessToken,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
      },
    });
    return transporter;
  } catch (err) {
    return err;
  }
};

interface emailTemplate {
  to: string;
  title: string;
  body: string;
  isHTML: boolean;
}
export const sendEmail = async (
  { to, title, body, isHTML }: emailTemplate,
  noreply: boolean = true
) => {
  try {
    let mailBody = {};
    isHTML ? (mailBody['html'] = body) : (mailBody['text'] = body);

    const mailOptions = {
      from: process.env.EMAIL_USER_FROM_EMAIL,
      to,
      replyTo: `${
        noreply
          ? process.env.EMAIL_USER_NO_REPLY
          : process.env.EMAIL_USER_FROM_EMAIL
      }`,
      subject: title,
      ...mailBody,
    };
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return err;
      }
      return info;
    });
  } catch (e) {
    return e;
  }
};

export const runEmailTransaction = async (emailList: string[]) => {
  Promise.allSettled(emailList).then((results) => {
    results.forEach(async (result) => {
      if (result.status == 'fulfilled') {
        console.log(`email sent: `, result);
      }
    });
  });
};

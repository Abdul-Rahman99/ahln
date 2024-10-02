import nodemailer from 'nodemailer';
import { User } from '../types/user.type';

export const sendEmailInvitation = async (user: User) => {
  try {
    const emailTemplate = `
                  <p>Hello, </strong></p>
                  <p>You have received an invitation to join our <strong>AHLN app.</strong></p>
                  <a href="https://apps.apple.com/ae/app/ahln/id6479874039 "> <strong>Invite Link</strong></a>
                  <p>If you didn't recognize this, please ignore this email.</p>
                  `;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'developer@dccme.ai', // replace this with developer@dccme.ai
        pass: 'yfen ping pjfh emkp', // replace this with google app password
      },
    });
    const mailOptions = {
      from: 'AHLN App <developer@dccme.ai>',
      to: user.email,
      subject: `Invitation to join the AHLN app`,
      html: emailTemplate,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

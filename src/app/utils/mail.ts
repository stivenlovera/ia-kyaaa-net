import nodemailer from 'nodemailer';
import logger, { jsonLog } from './logger';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: false,
  port: 587,
  auth: {
    user: 'stivenlovera',
    pass: 'gzwbityxzswnnsqt',
  },
});

export const sendEmail = async (to: string, subject: string, name: string, html: string) => {
  logger.info(`sendEmail to ${jsonLog(to)}`)
  return transporter.sendMail({
    from: '"Kyaaa Team" <notifications@kyaaa.net>', // Must be from a verified domain
    to: to,//'stivenlovera@resend.dev',
    subject: subject,//'Welcome',
    
    html: html,
  })
};
import nodemailer from 'nodemailer';

import {SMTP} from '../constants/index.js';
import {getEnvVar} from './getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  secure: false,
  auth:{
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

export const  sendMail = async (options) => {
  return await transporter.sendMail(options);
};

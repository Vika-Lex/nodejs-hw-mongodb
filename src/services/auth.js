import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { randomBytes } from 'crypto';
import {
  FIFTEEN_MINUTES,
  ONE_DAY,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshUsersSessions = async ({sessionId, refreshToken}) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken
  });
  if (!session) {
    throw new createHttpError(401, 'Session not found');
  }
  const isSessionsTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionsTokenExpired) {
    throw new createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken
  });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession
  });
};


export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'User already exists');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found');
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.deleteOne({userId: user._id});

  const session = createSession();
  return await SessionsCollection.create({
    userId: user._id,
    ...session,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};


export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({email});
  if (!user) throw createHttpError(404, 'User not found!');

  const resetToken = jwt.sign({ sub: user._id, email }, getEnvVar('JWT_SECRET'), { expiresIn: '5m' });

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html'
  );

  const templateSource = (
    (await fs.readFile(resetPasswordTemplatePath)).toString()
  );

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendMail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html
    });
  } catch (err) {
    console.error('Email sending error:', err);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }

};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub
  });
  if (!user) throw createHttpError(404, 'User not found!');
  const encryptedPassword = await  bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    {_id: user._id },
    {password: encryptedPassword},
  );

  await SessionsCollection.deleteOne({userId: user._id});

};

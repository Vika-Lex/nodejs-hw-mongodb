import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';
export const initMongoDB = async () => {
  try {
    const user = getEnvVar('MONGO_DB_USER');
    const pws = getEnvVar('MONGO_DB_PASSWORD');
    const url = getEnvVar('MONGO_DB_URL');
    const db = getEnvVar('MONGO_DB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${pws}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
    );


    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};

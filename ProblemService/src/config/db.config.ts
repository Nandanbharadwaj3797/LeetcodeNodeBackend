import mongoose from "mongoose";
import logger from "./logger.config";
import { serverConfig } from ".";

export const connectDB = async () => {
  try{
    const dbUrl=serverConfig.DB_URL;

    await mongoose.connect(dbUrl);

    logger.info(`Successfully connected to the mongoose database`);

    mongoose.connection.on('error', (error) => {
      logger.error(`Mongoose connection error: ${error}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn(`Mongoose connection disconnected`);
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  }catch(error){
    logger.error(`Error connecting to the mongoose database: ${error}`);
    process.exit(1);
  }
};
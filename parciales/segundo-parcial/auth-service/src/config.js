import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES,
  }
};

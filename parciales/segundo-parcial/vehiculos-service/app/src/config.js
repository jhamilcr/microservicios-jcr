import 'dotenv/config';

export const config = {
  jwt: {
    // accessSecret: process.env.JWT_ACCESS_SECRET,
    // refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessSecret: 'clave-muy-larga',
    refreshSecret: 'clave-muy-larga',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES,
  }
};

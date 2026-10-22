export const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/booking";

export const JWT_SECRET =
  process.env.JWT_SECRET ||
  "supersegreto";

export const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN ||
  "8h";

export const TOKEN_EXPIRES_IN =
  process.env.TOKEN_EXPIRES_IN ||
  "8h";

export const SENDGRID_KEY =
  process.env.SENDGRID_KEY ||
  "";

export const DB_USER =
  process.env.DB_USER ||
  "postgres";

export const DB_PASSWORD =
  process.env.DB_PASSWORD ||
  "postgres";

export const DB_HOST =
  process.env.DB_HOST ||
  "localhost";

export const DB_PORT =
  Number(process.env.DB_PORT) ||
  5432;

export const DB_NAME =
  process.env.DB_NAME ||
  "booking";

export const APP_PORT =
  Number(process.env.APP_PORT) ||
  5000;

export const APP_ENV =
  process.env.NODE_ENV ||
  "development";
export const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME || "";

export const CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY || "";

export const CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET || "";


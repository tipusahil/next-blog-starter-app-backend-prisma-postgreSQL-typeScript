import dotenv from "dotenv";

dotenv.config();

//   ----------step-1---
interface IEnvConfig {
  PORT: string;
  NODE_ENV: string;
  DATABASE_URL: string;
  FRONTEND_URL: string;
  FRONTEND_DEV_URL: string;
}

//   ----------step-2---
const loadEnvVariables = (): IEnvConfig => {
  //   ----------step-3---
  const requiredEnvVariables: string[] = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL",
    "FRONTEND_URL",
    "FRONTEND_DEV_URL",
  ];

  //   ----------step-4---
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing the require Environment variable ${key}`);
    }
  });

  //   ----------step-5---
  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    DATABASE_URL: process.env.DATABASE_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    FRONTEND_DEV_URL: process.env.FRONTEND_DEV_URL as string,
  };
};

// ---------step-6---
export const envVars = loadEnvVariables();

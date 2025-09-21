// import { PrismaClient } from '@prisma/client';

/* /*
/*
 তুমি যদি schema.prisma-তে  file e এইরকম কিছু দিয়ে থাকো 👇 
generatorr client {
  provider = "prisma-client-js"
  output   = "../generated/prisma" // ei line ta  dewa take tahle 
}
  তাহলে তোমাকে import করতে হবে:
import { PrismaClient } from "../../../generated/prisma";

আর default থাকলে: ortat (output   = "../generated/prisma" ) ei line ta na dile tokon niser niome import hobe
import { PrismaClient } from "@prisma/client";
 */
import { PrismaClient } from "../../../generated/prisma";

export const prisma = new PrismaClient();

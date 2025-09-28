import { Prisma, UserModel } from "../../../../generated/prisma"; // prisma/client theke import hocce
// import { Prisma, UserModel } from '@prisma/client';

import { prisma } from "../../config/db.config";

export const userDataForResponse = {
  id: true,
  name: true,
  email: true,
  password: false, // password bad diye baki data dibe.
  role: true,
  phone: true,
  picture: true,
  status: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
  posts: {
    // select use na korle include ta use kore then onno table/collection theke data ante hbe,nise dewa ase kivabe.
    select: {
      id: true,
      title: true,
      content: true,
      thumbnail: true,
      isFeatured: true,
      tags: true,
      view: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

// ----1. create user--
const createUser = async (payload: Prisma.UserModelCreateInput ) => {
  const { email } = payload;

  const isUserEixst = await prisma.userModel.findUnique({ where: { email } });
  // const isUserEixst = await prisma.userModel.findUnique({ where: { email } }); // age theke email duplicate thakle migrate korlew kaj korbena, tai findUnqiue diye kojte gele sei field ta unique hote hoi.

  if (isUserEixst) {
    throw new Error("user already exist!");
  }
   if (!isUserEixst) {
    const createUser = await prisma.userModel.create({
      data : payload,
       select: userDataForResponse,
    });
console.log(createUser)
    // const { password ,...rest} = createUser;// select use koreci vitore tai baire password destruct korar drkr nai, 
    return {
      // data : rest,
      data : createUser,
      message : "user created successfully",
    };
  }

 
};

// ----2. update user--
const updateUser = async (
  id: number,
  payload: Prisma.UserModelUpdateInput
): Promise<Partial<UserModel>> => {
  // const updateUser = async (id : number,payload: Prisma.UserModelUpdateInput) => {
  console.log("update user func", payload);
  const result = await prisma.userModel.update({
    where: { id: id },
    data: payload,
    select: userDataForResponse,
  });
  return result;
};

// -----3. get All users ---
const getAllUsers = async () => {
  console.log("all users");
  const allUsers = await prisma.userModel.findMany({
    select: userDataForResponse,
    orderBy: {
      createdAt: "desc",
      // id : "desc"
    },
    // include : {// populate er kajtai ei (include) ta kore dei
    //     posts : {
    //         select : {title : true},
    //     },
    // },
  });
  const allUsersMeta = await prisma.userModel.count();

  return {
    data: allUsers,
    meta: allUsersMeta,
  };
};

// ------4. getUserById---

const getUserById = async (id: number) => {
  const result = await prisma.userModel.findUnique({
    where: {
      id: id,
    },
    select: userDataForResponse,
  });

  const totalPosts = result?.posts.length;
  return {
    totalPosts : totalPosts,
    data : result,
  };
};

// --------5. deleteUser ---
const deleteUser = async (id: number) => {
  const result = await prisma.userModel.delete({
    where: {
      id: id,
    },
  });

  return result;
};

// ---------------
export const userServices = {
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
};

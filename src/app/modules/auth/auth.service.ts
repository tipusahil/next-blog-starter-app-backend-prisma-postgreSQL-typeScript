
import { Prisma } from "../../../../generated/prisma";
import { prisma } from "../../config/db.config";
import { userDataForResponse } from "../user/user.service";

const loginWithEmailAndPassword = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const isUserEixst = await prisma.userModel.findFirst({ where: { email } });
  // const isUserEixst = await prisma.userModel.findUnique({ where: { email } }); // age theke email duplicate thakle migrate korlew kaj korbena, tai findUnqiue diye kojte gele sei field ta unique hote hoi.

  if (!isUserEixst) {
    throw new Error("user not found!");
  }

  // if(isUserEixst.password !== password){
  // throw new Error("password does not match!");
  // }

  if (isUserEixst.password === password) {
    const {password , ...rest} = isUserEixst;
    return {
      message: "user logged successfully",
      data: rest,
    };
  } else {
    throw new Error("password does not match!");
  }

  // return isUserEixst;
};

// ---------2. authWithGoogle

const authWithGoogle = async (payload: Prisma.UserModelCreateInput) => {
  let user = await prisma.userModel.findFirst({
    where: { email: payload.email },
  });


  if(!user) {
// throw new Error("user not found!");
user = await prisma.userModel.create({ data : payload});
}

return {
  message : "user login with google,authentication successfull",
  data : user,
}
};

const userRegisterWithCredentials = async (payload: Prisma.UserModelCreateInput ) => {
  const { email } = payload;

  const isUserEixst = await prisma.userModel.findFirst({ where: { email } });
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

export const authServices = {
  loginWithEmailAndPassword,
  authWithGoogle,
  userRegisterWithCredentials
};

import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db.config";

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
    return {
      message: "user login successfully",
      data: isUserEixst,
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



export const authServices = {
  loginWithEmailAndPassword,
  authWithGoogle,
};

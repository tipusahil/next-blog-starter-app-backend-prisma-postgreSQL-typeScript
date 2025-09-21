import { Router } from "express";
import { userControllers } from "./user.controller";








const UserRoutes : Router = Router();

UserRoutes.get("/",userControllers.getAllUsers);// get er gula upore raka valo
UserRoutes.get("/:id",userControllers.getUserById);
UserRoutes.post("/create",userControllers.createUser);
UserRoutes.patch("/update/:id",userControllers.updateUser);
UserRoutes.delete("/delete/:id",userControllers.deleteUser);

// ------------
export default UserRoutes;
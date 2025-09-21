import { Router } from "express";
import { authControllers } from "./auth.controller";

const AuthRoutes: Router = Router();

AuthRoutes.post("/login", authControllers.loginWithEmailAndPassword);
AuthRoutes.post("/google/login", authControllers.authWithGoogle);

export default AuthRoutes;

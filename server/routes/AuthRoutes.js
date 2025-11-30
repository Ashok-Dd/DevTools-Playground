import { Router } from "express";
import { CheckAuth, GoogleLogin, Login, Logout, Register } from "../controllers/AuthController.js";
import { VerifyToken } from "../middlewares/verifyToken.js";


const authRouter = Router();

authRouter.post("/login" , Login) ;
authRouter.post("/google-login" , GoogleLogin) ;
authRouter.post("/register" , Register) ;
authRouter.get("/check-auth" , VerifyToken , CheckAuth) ;
authRouter.post("/logout" , Logout) ;


export default authRouter ;
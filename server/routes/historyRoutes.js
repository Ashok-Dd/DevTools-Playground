import { Router } from "express";
import { DeleteHistoryItem, GetHistory, SaveToHistory } from "../controllers/historyController.js";
import { VerifyToken } from "../middlewares/verifyToken.js";

const historyRouter = Router() ;

historyRouter.get("/" ,VerifyToken , GetHistory) ;
historyRouter.post("/" , VerifyToken , SaveToHistory ) ;
historyRouter.delete("/:historyId" , VerifyToken , DeleteHistoryItem ) ;

export default historyRouter ;
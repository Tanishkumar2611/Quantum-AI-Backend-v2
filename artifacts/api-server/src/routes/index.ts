import { Router, type IRouter } from "express";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(chatRouter);

export default router;

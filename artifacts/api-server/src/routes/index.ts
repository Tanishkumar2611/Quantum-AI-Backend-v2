import { Router, type IRouter } from "express";
import chatRouter from "./chat";
import generateImageRouter from "./generate-image";

const router: IRouter = Router();

router.use(chatRouter);
router.use(generateImageRouter);

export default router;

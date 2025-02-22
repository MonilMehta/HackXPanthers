import { Router } from "express";
import { createEvent } from "../controllers/event.controller";

const router = Router();

router.route("/createEvent").post(createEvent);

export default router

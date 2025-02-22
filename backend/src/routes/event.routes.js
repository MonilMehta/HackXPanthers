import { Router } from "express";
import { createEvent, getEventDetails } from "../controllers/event.controller";

const router = Router();

router.route("/createEvent").post(createEvent);
router.route("/getEventDetails").get(getEventDetails);

export default router

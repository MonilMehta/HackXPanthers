import { Router } from "express";
import { createEvent, getEventDetails, approveEvent } from "../controllers/event.controller";

const router = Router();

router.route("/createEvent").post(createEvent);
router.route("/getEventDetails").get(getEventDetails);
router.route("/approveEvent").post(approveEvent);

export default router

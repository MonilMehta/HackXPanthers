import { Router } from "express";
import { createEvent, getEventDetails, approveEvent, filterEventsByType, getEventsByDate  } from "../controllers/event.controller.js";

const router = Router();

router.route("/createEvent").post(createEvent);
router.route("/getEventDetails").get(getEventDetails);
router.route("/approveEvent").post(approveEvent);
router.route("/filterEventsByType").get(filterEventsByType);
router.route("/getEventsByDate").get(getEventsByDate);

export default router

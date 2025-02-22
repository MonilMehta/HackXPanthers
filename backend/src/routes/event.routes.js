import { Router } from "express";
import { createEvent, getEventDetails, approveEventByAdmin, approveEventByVenueManager, rejectEvent, getEventsByDate, filterEventsByType, getPendingEventsAdmin, getPendingEventsVenueManager, getEventById } from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createEvent").post(verifyJWT, createEvent);
router.route("/getEventDetails").get(verifyJWT, getEventDetails);
router.route("/approveEventByAdmin").post(verifyJWT, approveEventByAdmin);
router.route("/approveEventByVenueManager").post(verifyJWT, approveEventByVenueManager);
router.route("/rejectEvent").post(verifyJWT, rejectEvent);
router.route("/getEventsByDate").post(verifyJWT, getEventsByDate);
router.route("/filterEventsByType").post(verifyJWT, filterEventsByType);
router.route("/getPendingEventsAdmin").get(verifyJWT, getPendingEventsAdmin);
router.route("/getPendingEventsVenueManager").get(verifyJWT, getPendingEventsVenueManager);
router.route("/getEventById/:eventId").get(verifyJWT, getEventById);

export default router;

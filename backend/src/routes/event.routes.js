import { Router } from "express";
import { createEvent, getEventDetails, approveEventByAdmin, approveEventByVenueManager, rejectEvent, getEventsByDate, filterEventsByType, getPendingEventsAdmin, getPendingEventsVenueManager, getEventById, proposeNegotiation, respondToNegotiation } from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createEvent").post(verifyJWT, createEvent);
router.route("/getEventDetails").get(verifyJWT, getEventDetails);
router.route("/approveEventByAdmin").post( approveEventByAdmin);
router.route("/approveEventByVenueManager").post(verifyJWT, approveEventByVenueManager);
router.route("/rejectEvent").post(verifyJWT, rejectEvent);
router.route("/getEventsByDate").post(verifyJWT, getEventsByDate);
router.route("/filterEventsByType").post(verifyJWT, filterEventsByType);
router.route("/getPendingEventsAdmin").get( getPendingEventsAdmin);
router.route("/getPendingEventsVenueManager").get(verifyJWT, getPendingEventsVenueManager);
router.route("/getEventById/:eventId").get(verifyJWT, getEventById);
router.route("/proposeNegotiation").post(verifyJWT, proposeNegotiation);
router.route("/respondToNegotiation").post(verifyJWT, respondToNegotiation);

export default router;

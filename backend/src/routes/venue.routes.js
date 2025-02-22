import { Router } from "express";
import { registerVenue, getAllVenues, bookVenue } from "../controllers/venue.controller";

const router = Router();

router.route("/registerVenue").post(registerVenue);
router.route("/getAllVenues").get(getAllVenues);
router.route("/bookVenue").post(bookVenue);

export default router


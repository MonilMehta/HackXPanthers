import { Router } from "express";

import { rateArtist, rateVenue, getArtistReviews, getVenueReviews } from "../controllers/review.controllers.js";

const router = Router();

router.route("/rateArtist").post(rateArtist);
router.route("/rateVenue").post(rateVenue);
router.route("/getArtistReviews").get(getArtistReviews);
router.route("/getVenueReviews").get(getVenueReviews);

export default router
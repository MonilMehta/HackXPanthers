import { Router } from "express";
import { followArtist, getFollowers, unfollowArtist } from "../controllers/followers.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getFollowedArtists } from "../controllers/user.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/follow-artist").post(followArtist);

router.route("/unfollow-artist").post(unfollowArtist);

router.route("/get-followers").get(getFollowers);

router.route("/get-followings").get(getFollowedArtists);

export default router
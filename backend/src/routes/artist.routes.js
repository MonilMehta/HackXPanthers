import { Router } from "express";
import { createArtist, loginArtist, viewArtist, getArtistById, getArtists} from "../controllers/artist.controller.js";

const router = Router();

router.route("/registerArtist").post(createArtist);

router.route("/loginArtist").post(loginArtist);

router.route("/getArtist").get(getArtists);

router.route("/getOneArtist").get(getArtistById);

router.route("/viewArtist").get(viewArtist);


export default router
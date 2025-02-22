import { Router } from "express";
import { bookTickets , getAvailableSeats, getUserTickets} from "../controllers/ticket_book.controllers.js";

const router = Router();

router.route("/bookTickets").post(bookTickets);
router.route("/getAvailableSeats").get(getAvailableSeats);
router.route("/getUserTickets").get(getUserTickets);

export default router

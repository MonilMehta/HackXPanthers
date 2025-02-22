import { Router } from "express";
import { bookTickets , getAvailableSeats} from "../controllers/ticket_book.controllers.js";

const router = Router();

router.route("/bookTickets").post(bookTickets);
router.route("/getAvailableSeats").get(getAvailableSeats);

export default router

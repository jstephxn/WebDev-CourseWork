// routes/views.js
import { Router } from "express";
import {
  homePage,
  courseDetailPage,
  postBookCourse,
  postBookSession,
  bookingConfirmationPage,
} from "../controllers/viewsController.js";

import { coursesListPage } from "../controllers/coursesListController.js";
import { loginPage, registerPage } from "../controllers/viewsController.js";

const router = Router();

router.get("/", homePage);
router.get("/courses", coursesListPage);
router.get("/courses/:id", courseDetailPage);
router.post("/courses/:id/book", postBookCourse);
router.post("/sessions/:id/book", postBookSession);
router.get("/bookings/:bookingId", bookingConfirmationPage);
router.get("/login", loginPage);
router.get("/register", registerPage);

export default router;

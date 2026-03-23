import { Router } from "express";
import { 
    createCourse,
    deleteCourse,
    viewCourseParticipants,
    showCreateCoursePage
} from "../controllers/adminController.js";

const router = Router();

router.get("/courses/new", showCreateCoursePage);
router.post("/courses", createCourse);
router.post("/courses/:id/delete", deleteCourse);
router.get("/courses/:id/participants", viewCourseParticipants);

export default router;
import { Router } from "express";
import { 
    createCourse,
    deleteCourse,
    viewCourseParticipants,
    showCreateCoursePage,
    deleteSession
} from "../controllers/adminController.js";

const router = Router();

router.get("/courses/new", showCreateCoursePage);
router.post("/courses", createCourse);
router.post("/courses/:id/delete", deleteCourse);
router.get("/sessions/:id/participants", viewCourseParticipants);
router.post("/sessions/:id/delete", deleteSession);

export default router;
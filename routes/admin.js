import { Router } from "express";
import { 
    createCourse,
    deleteCourse,
    viewCourseParticipants,
    showCreateCoursePage,
    deleteSession,
    createSession,
    showCreateSessionPage,
    showAllUsersPage,
    showCreateUserPage,
    createUser,
    deleteUser
} from "../controllers/adminController.js";

const router = Router();

router.get("/courses/new", showCreateCoursePage);
router.post("/courses", createCourse);
router.post("/courses/:id/delete", deleteCourse);
router.get("/sessions/:id/participants", viewCourseParticipants);
router.post("/sessions/:id/delete", deleteSession);
router.get("/courses/:courseId/sessions/new", showCreateSessionPage);
router.post("/courses/:courseId/sessions", createSession);
router.get("/admin/display_users", showAllUsersPage);
router.get("/admin/create_user", showCreateUserPage);
router.post("/admin/create_user", createUser);
router.post("/admin/:id/delete_user", deleteUser);


export default router;
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
    deleteUser,
    showEditCoursePage,
    updateCourse,
    showEditUserPage,
    updateUser
} from "../controllers/adminController.js";

const router = Router();

// Course management routes
router.get("/courses/new", showCreateCoursePage);
router.post("/courses", createCourse);
router.post("/courses/:id/delete", deleteCourse);
router.get("/courses/:id/edit", showEditCoursePage);
router.post("/courses/:id/update", updateCourse);

// Session management routes
router.get("/sessions/:id/participants", viewCourseParticipants);
router.post("/sessions/:id/delete", deleteSession);
router.get("/courses/:courseId/sessions/new", showCreateSessionPage);
router.post("/courses/:courseId/sessions", createSession);

// User management routes
router.get("/display_users", showAllUsersPage);
router.get("/create_user", showCreateUserPage);
router.post("/create_user", createUser);
router.get("/users/:id/edit", showEditUserPage);
router.post("/users/:id/update", updateUser);
router.post("/:id/delete_user", deleteUser);


export default router;
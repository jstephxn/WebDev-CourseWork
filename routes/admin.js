import { Router } from "express";
import { 
    createCourse,
    deleteCourse,
    viewCourseParticipants,
    showCreateCoursePage,
    deleteSession,
    createSession,
    showAllUsersPage,
    showCreateUserPage,
    createUser,
    deleteUser,
    showEditCoursePage,
    updateCourse,
    showEditUserPage,
    updateUser
} from "../controllers/adminController.js";
import { requireInstructor } from '../middlewares/auth.js'

const router = Router();

// Course management routes
router.get("/courses/new", requireInstructor, showCreateCoursePage);
router.post("/courses", requireInstructor, createCourse);
router.post("/courses/:id/delete", requireInstructor, deleteCourse);

router.get("/courses/:id/edit", requireInstructor, showEditCoursePage);
router.post("/courses/:id/update", requireInstructor, updateCourse);

// Session management routes
router.get("/sessions/:id/participants", requireInstructor, viewCourseParticipants);
router.post("/sessions/:id/delete", requireInstructor, deleteSession);
router.post("/courses/:courseId/sessions", requireInstructor, createSession);

// No long in use as we are now creating sessions through the course page
// router.get("/courses/:courseId/sessions/new", showCreateSessionPage);



// User management routes
router.get("/display_users", requireInstructor, showAllUsersPage);
router.get("/create_user", requireInstructor, showCreateUserPage);
router.post("/create_user", requireInstructor, createUser);
router.get("/users/:id/edit", requireInstructor, showEditUserPage);
router.post("/users/:id/update", requireInstructor, updateUser);
router.post("/:id/delete_user", requireInstructor, deleteUser);


export default router;
import {CourseModel} from "../models/courseModel.js";
import { SessionModel } from "../models/sessionModel.js";
import { BookingModel } from "../models/bookingModel.js";
import { UserModel } from "../models/userModel.js";

// Create a new course
export const createCourse = async (req, res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
  try {
    const course = await CourseModel.create({
        title: req.body.title,
        description: req.body.description,
        level: req.body.level,
        type: req.body.type,
        instructorId: req.session.user?._id,
        allowDropIn: req.body.allowDropIn === "on",
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        sessionIds: []
    });
    res.redirect(`/courses/${course._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to create course");
  }
};

export const showCreateCoursePage = (req,res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
    res.render("create_course", { title: "Create Course" });
};

// Delete a course and its sessions
export const deleteCourse =  (req, res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
   CourseModel.delete(req.params.id);
   SessionModel.deleteByCourse(req.params.id);
  res.redirect("/courses");
};

// View Course participants (bookings)
export const viewCourseParticipants = async (req, res) => { 
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
    try{
        if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to view participants."); }

        const sessionid = req.params.id;

        // Get all bookings for this session 
        const bookings = await BookingModel.findBySessionId(sessionid);

        //Get user details for each booking
        const participants = await Promise.all(
            bookings.map(async (b) => {
                const user = await UserModel.findById(b.userId);
                return {
                    name: user.name || "Unknown",
                    email: user.email || "Unknown",
                    status: b.status,
                };
            })
        );      
        
        // Render the participants page with the retrieved data from the database
        res.render("participants", { title: "Course Participants", participants });
        
        } catch(err){
        console.error(err);
        res.status(500).json("Failed to retrieve participants");
    }
};

export const deleteSession = async (req,res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
    try {
        await SessionModel.delete(req.params.id);
        res.redirect("/courses");
    } catch (err) {
        console.error(err);
        res.status(500).json("Failed to delete session");
    }
};

// No long in use as we are now creating sessions through the course page
// export const showCreateSessionPage = async (req,res) => {
//     if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
//     const course = await CourseModel.findById(req.params.courseId);
//     if(!course) return res.status(404).send("Course not found");

//     res.render("create_session", {course, title : "Create Session" });
// };

export const createSession = async  (req,res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
    const courseId = req.params.courseId;

    const { startDateTime, endDateTime, capacity } = req.body;

    await SessionModel.create({
        courseId,
        startDateTime,
        endDateTime,
        capacity: Number(capacity),
        bookedCount: 0
    });

    res.redirect(`/courses/${courseId}`);
};

export const showCreateUserPage = (req, res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
    res.render("create_user", { title: "Create User" });
};

export const createUser = async (req,res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
    const { name, email, password, role } = req.body;
    await UserModel.create({
        name,
        email,
        password,
        role
    });
    res.redirect("/admin/display_users");
};

export const showAllUsersPage = async (req, res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
    const users = await UserModel.findAll();
    res.render("display_users", { users });
};

export const deleteUser = async (req, res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
    const userId = req.params.id;
    await UserModel.delete(userId);
    res.redirect("/admin/display_users");
};

export const showEditCoursePage = async (req, res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
    const course = await CourseModel.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found");
    res.render("edit_course", { course, title: "Edit Course" });
};

export const updateCourse = async (req, res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
    const courseId = req.params.id;
    const { title, description, level, type, allowDropIn, startDate, endDate } = req.body;
    await CourseModel.update(courseId, { title, description, level, type, allowDropIn, startDate, endDate });
    res.redirect(`/courses/${courseId}`);
};

export const showEditUserPage = async (req, res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }

    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.render("edit_user", { user, title: "Edit User" });
};

export const updateUser = async (req, res) => {
    if(!req.session.user?.role === "instructor"){ return res.status(401).send("You must be an instructor to create a course."); }
    const userId = req.params.id;
    const { name, email, role } = req.body;
    await UserModel.update(userId, { name, email, role });
    res.redirect("/admin/display_users");
};



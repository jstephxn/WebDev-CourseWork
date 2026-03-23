import {CourseModel} from "../models/courseModel.js";
import { SessionModel } from "../models/sessionModel.js";
import { BookingModel } from "../models/bookingModel.js";

// Create a new course
export const createCourse = async (req, res) => {
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
export const deleteCourse = async (req, res) => {
  await CourseModel.delete(req.params.id);
  await SessionModel.deleteByCourse(req.params.id);
  res.json({ message: "Course and its sessions deleted" });
};

// View Course participants (bookings)
export const viewCourseParticipants = async (req, res) => { 
    const bookings = await BookingModel.listByCourse(req.params.id);
    res.render("course_participants", { title: "Course Participants", bookings });
};
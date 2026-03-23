import {CourseModel} from "../models/courseModel.js";
import { SessionModel } from "../models/sessionModel.js";
import { BookingModel } from "../models/bookingModel.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const course = await CourseModel.create(req.body);
    res.status(201).json({ course });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
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
// services/bookingService.js
import { CourseModel } from "../models/courseModel.js";
import { SessionModel } from "../models/sessionModel.js";
import { BookingModel } from "../models/bookingModel.js";

const canReserveAll = (sessions) =>
  sessions.every((s) => (s.bookedCount ?? 0) < (s.capacity ?? 0));

export async function bookCourseForUser(userId, courseId) {
  // Prevent double bookings
  const existing = await BookingModel.findByUserAndCourse(userId, courseId);
  if (existing && existing.length > 0) {
    throw new Error("You have already booked this course");
  }

  const existingSession = await BookingModel.find({
    userId, 
    type: "SESSION",
    courseId   
  });

  // Check if a user has already booked a session in the course.
  if(existingSession && existingSession.length > 0){
    throw new Error("You have already booked a session for this course.")
  }

  const course = await CourseModel.findById(courseId);
  if (!course) throw new Error("Course not found");

  const sessions = await SessionModel.listByCourse(courseId);
  if (sessions.length === 0) throw new Error("Course has no sessions");

  let status = "CONFIRMED";
  if (!canReserveAll(sessions)) {
    status = "WAITLISTED";
  } else {
    for (const s of sessions) {
      await SessionModel.incrementBookedCount(s._id, 1);
    }
  }

  return BookingModel.create({
    userId,
    courseId,
    type: "COURSE",
    sessionIds: sessions.map((s) => s._id),
    status,
  });
}

export async function bookSessionForUser(userId, sessionId) {
  // 🔒 PREVENT DOUBLE BOOKING
  const existing = await BookingModel.findByUserAndSession(userId, sessionId);
  if (existing) {
    throw new Error("You have already booked this session");
  }

  const session = await SessionModel.findById(sessionId);
  if (!session) throw new Error("Session not found");

  const course = await CourseModel.findById(session.courseId);
  if (!course) throw new Error("Course not found");

  // Check if th euser has already booked this course
  const existingCourse = BookingModel.findByUserAndCourse(userId, session.courseId);
  if(existingCourse){
    throw new Error("You have already booked the full course.")
  }

  if (!course.allowDropIn && course.type === "WEEKLY_BLOCK") {
    const err = new Error("Drop-in not allowed for this course");
    err.code = "DROPIN_NOT_ALLOWED";
    throw err;
  }

  let status = "CONFIRMED";
  if ((session.bookedCount ?? 0) >= (session.capacity ?? 0)) {
    status = "WAITLISTED";
  } else {
    await SessionModel.incrementBookedCount(session._id, 1);
  }

  return BookingModel.create({
    userId,
    courseId: course._id,
    type: "SESSION",
    sessionIds: [session._id],
    status,
  });
}

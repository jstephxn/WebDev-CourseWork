// controllers/bookingController.js
import {
  bookCourseForUser,
  bookSessionForUser,
} from "../services/bookingService.js";
import { BookingModel } from "../models/bookingModel.js";
import { SessionModel } from "../models/sessionModel.js";

export const bookCourse = async (req, res) => {
  try {
    const userId = req.session.user?._id;

    // Get course ID from url param instead of body
    const courseId = req.params._id;

    //Ensure user is logged in 
    if(!userId){ return res.status(401).send("You must be logged in to book a course."); }

    const booking = await bookCourseForUser(userId, courseId);
    res.status(201).redirect(`/bookings/${booking._id}`);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const bookSession = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;
    const booking = await bookSessionForUser(userId, sessionId);
    res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    res
      .status(err.code === "DROPIN_NOT_ALLOWED" ? 400 : 500)
      .json({ error: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.status(401).send("Not logged in");

    const { bookingId } = req.params;

    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    // SECURITY CHECK
    if (booking.userId !== user._id) {
      return res.status(403).send("Not allowed");
    }

    // If already cancelled, just return
    if (booking.status === "CANCELLED") {
      return res.redirect("/auth/account");
    }

    // Update capacity ONLY if confirmed
    if (booking.status === "CONFIRMED") {
      for (const sid of booking.sessionIds) {
        await SessionModel.incrementBookedCount(sid, -1);
      }
    }

    // Mark as cancelled
    await BookingModel.cancel(bookingId);

    // Redirect back to account page
    res.redirect("/auth/user_account");

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to cancel booking");
  }
};

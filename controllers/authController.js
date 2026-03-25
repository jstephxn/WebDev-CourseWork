import bcrypt from "bcrypt";
import {UserModel} from "../models/userModel.js";
import {BookingModel} from "../models/bookingModel.js";
import {CourseModel} from "../models/courseModel.js";
import {SessionModel} from "../models/sessionModel.js"

// Show login page
export const showLoginPage = (req, res) => {
    res.render("login");
}

// Show registration page
export const showRegisterPage = (req, res) => {
    res.render("register");
}

// Handle registration form submission
export const registerUser = async (req, res) => {
    const { name, password, confirmPassword } = req.body;
    const email = req.body.email.trim().toLowerCase();

    // Basic validation
    if (!name || !email || !password) {
        return res.render("register", { error: "All fields are required.", name, email, password: "" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render("register", { error: "Please enter a valid email address.", name, email, password: "" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail({ where: { email } });
    if (existingUser) {
        return res.render("register", { error: "Email is already registered.", name, email, password: "" });
    }

    // Check passwords match
    if (password !== confirmPassword) {
        return res.render("register", { error: "Passwords do not match.", name, email });
    }

    // Password strength validation (at least 8 characters, one uppercase, one lowercase, one number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.render("register", { error: "Password must be at least 8 characters long and include uppercase, lowercase letters, and a number.", name, email, password: "" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await UserModel.create({
        name,  
        email, 
        password: hashedPassword ,
        role: "student"
    });

    // Log in the user after registration
    req.session.user = newUser; 

    // Redirct user to home page
    res.redirect("/");
};


// Handle the login form submission
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // find user by email
    console.log("EMAIL", req.body);
    const user = await UserModel.findByEmail(email);
    if (!user) { return res.send("Invalid email"); }

    // compare password with stored hash
    console.log("PASSWORDS", password, user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { return res.send("Invalid password."); }

    // save user in session
    req.session.user = user;

    // redirect to home page
    res.redirect("/");
};

// Handle logout
export const logoutUser = (req, res) => {
    req.session.destroy();
    res.redirect("/");
};

// Show change password page
export const showChangePasswordPage = (req, res) => {
    res.render("change_password");
};

// Handle change password form submission
export const changePassword = async (req, res) => {
    const user = req.session.user;
    if (!user) { return res.redirect("/auth/login"); }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    

    // Get a fresh user from the database
    const freshUser = await UserModel.findById(user._id);
    
    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, freshUser.password);

    if (!isMatch) {
        return res.error("Current password is incorrect.");
    }
    // Check passwords match
    if (newPassword !== confirmPassword) {
        return res.render("change_password", { error: "Passwords do not match."});
    }

    // Password strength validation (at least 8 characters, one uppercase, one lowercase, one number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.render("change_password", { error: "Password must be at least 8 characters long and include uppercase, lowercase letters, and a number."});
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await UserModel.updatePassword(user._id, hashedNewPassword);

    // Log the user out after changing password
    req.session.destroy();

    res.render("error", { message: "Password changed successfully. Please log in again." });
};

// Show user account page
export const showUserAccountPage = async (req, res, next) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");

    const bookings = await BookingModel.find({ userId: user._id });

    const enrichedBookings = await Promise.all(
      bookings.map(async (b) => {
        const course = await CourseModel.findById(b.courseId);

        const sessions = await Promise.all(
          (b.sessionIds || []).map(async (sid) => {
            const s = await SessionModel.findById(sid);
            return s
              ? {
                  start: new Date(s.startDateTime).toLocaleString(),
                  end: new Date(s.endDateTime).toLocaleString(),
                }
              : null;
          })
        );

        return {
          id: b._id,
          type: b.type,
          status: b.status,
          courseTitle: course?.title || "Unknown",
          sessions: sessions.filter(Boolean),
        };
      })
    );

    res.render("user_account", {
      title: "My Account",
      user,
      bookings: enrichedBookings,
    });

  } catch (err) {
    next(err);
  }
};


// Middleware to check if user is logged in and is an instructor
export const requireInstructor = (req, res, next) => {
  const user = req.session.user;

  // Not logged in
  if (!user) {
    return res.redirect("/login");
  }

  // Not an instructor
  if (user.role !== "instructor") {
    return res.status(403).render("error", {
      title: "Access denied",
      message: "You do not have permission to access this page."
    });
  }

  // Allowed
  next();
};

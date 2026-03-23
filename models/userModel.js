// models/userModel.js
import { usersDb } from "./_db.js";

export const UserModel = {
  // Create a new user with basic validation + defaults
  async create({ name, email, password, role = "student" }) {
    console.log("Creating user:", { name, email, role });
    // Basic validation
    if (!name || !email || !password) {
      throw new Error("Missing required user fields");
    }


    return usersDb.insert({
      name,
      email: email,
      password,
      role,
      createdAt: new Date().toISOString(),
    });
  },

  // Find user by email (used for login)
  async findByEmail(email) {
    return usersDb.findOne({ email: email });
  },

  // Find user by ID (used for sessions / bookings)
  async findById(id) {
    return usersDb.findOne({ _id: id });
  },
};
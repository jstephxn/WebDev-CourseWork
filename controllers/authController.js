import bcrypt from "bcrypt";
import {UserModel} from "../models/userModel.js";

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
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail({ where: { email } });
    if (existingUser) {
        return res.status(400).send("Email already taken.");
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


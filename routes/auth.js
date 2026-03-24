import {Router} from 'express';
import {
    showLoginPage, 
    showRegisterPage,
    registerUser,
    loginUser,
    logoutUser,
    showChangePasswordPage,
    changePassword,
    showUserAccountPage
} from '../controllers/authController.js';

const router = Router();

// Show login page
router.get('/login', showLoginPage);

// Show registration page
router.get('/register', showRegisterPage);

// Handle registration form submission
router.post('/register', registerUser);

// Handle login form submission
router.post('/login', loginUser);

// Handle logout
router.get('/logout', logoutUser);
router.post('/logout', logoutUser);

// Handle Password chanege
router.get('/change-password', showChangePasswordPage);
router.post('/change-password', changePassword);

// Show user account page
router.get('/user_account', showUserAccountPage);

export default router;
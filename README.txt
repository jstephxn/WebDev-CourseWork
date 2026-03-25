HOW TO RUN WEBSITE:
To run this website from visual studio open a new powershell terminal and run, 
    
    'npm i node express express-sessions bcrypt jsonwebtoken mustache-express nedb-promises '

After running the command above, in the same terminal run,
            
    'node index'

To stop running the website select the terminal and press ' CNTRL + C ' and the site will terminate.

The folder /views/graveyard contains old views that are no longer in use for this project due the view no longer being necessary for the original intended task.

List Key:

    ❌ - Not implemented
    🚧 - Implemented but needs testing
    ✅ - Implemented and working


📖 Features Implemented:
    
    ✅ User registration
    ✅ User Login

    ✅ Logged in users able to book course
    ✅ Logged in Users able to view 'My Account' Page
    ✅ Logged in Users able to change their password
    ✅ Logged in Users able to view their bookings
    ✅ Logged in Users able to book Sessions rather than a full course.

    ✅ Admins (Instructors) able to add new courses
    ✅ Admins (Instructors) can add new sessions to courses
    ✅ Admins (Instructors) able to Update Courses
    ✅ Admins (Instructors) able to delete courses
    ✅ Admins (Instructors) able to delete sessions
    ✅ Admins (Instructors) able to view a list of participants in the sessions
    ✅ Admins (Instructors) able to add users 
    ✅ Admins (Instructors) able to delete users
    ✅ Admins (Instructors) able to Update User (Name, role)
    ✅ Admins (Instructors) can change a Users Password
    ❌ Admins (Instructors) can download a csv of course bookings

    ✅ Fix Courses Filter
    ✅ Email Formatting check for registration
    ✅ Password Validation
    ✅ Add a show password button to login and register
    ❌ Prevent double booking
    ❌ Authorisation Middleware
    ✅ Refactor session creation to be under the course rather than seperate page
    ✅ Fix Session Booking (Courses always display Drop ins disabled)
    🚧 Waitlist for booking courses or sessions


    Visual Edits (CSS):
        
        ✅ Add images
        ✅ Update Navbar to contain a logo and better link layout
        ✅ Refine Homepage
        ❌ Refine Login
        ❌ Refine Register
        ❌ Refine Courses Page
        ❌ Refine Course Page
        ❌ Refine Booking confirmation
        ❌ Refine Class Creation
        ❌ Refine Class Editing
        ❌ Refine Session Creation
        ❌ Refine Action Buttons
        ❌ Refine User Creation
        ❌ Refine User Editing 

          

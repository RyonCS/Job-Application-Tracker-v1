import User from "../models/User.js";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

const secretToken = process.env.JWT_SECRET_KEY;

// Display the login page.
export const getLoginPage = (req, res) => {
  res.render("login");
};

// Display the register page.
export const getRegisterPage = (req, res) => {
  res.render("register");
};

// Login function once user types in username and password.
export const login = async (req, res) => {
  try {
    // Define passport authenticate without custom callback.
    passport.authenticate("local", (err, authenticatedUser) => {
      if (err || !authenticatedUser) {
        return res.redirect("/auth/login"); // Redirect on error or authentication failure.
      }

      req.login(authenticatedUser, (err) => {
        if (err) {
          return res.redirect("/auth/login"); // Redirect if there’s an error logging in.
        }

        req.session.user_id = authenticatedUser._id; // Save user ID in session.
        return res.redirect("/jobs/myJobs"); // Redirect to the user's job page.
      });
    })(req, res); // Trigger passport authentication.
  } catch (err) {
    console.log("Error during login process:", err);
    return res.redirect("/auth/login");
  }
};

// Register a new user.
export const register = async (req, res) => {
  const { emailAddress, password } = req.body;
  try {
    // Check if the email is already used by another user.
    const foundUser = await User.findOne({ emailAddress });
    // Change later.
    if (foundUser) return res.redictrect("/auth/login");

    // Create a new user and set sessionID to userId.
    const newUser = new User({ emailAddress });
    await User.register(newUser, password);
    await newUser.save();
    req.session.user_id = newUser._id;

    return res.redirect("/jobs/myJobs");
  } catch (err) {
    return res.redirect("/auth/login");
  }
};

// Logout by destroying session and rerouting to login.
export const logOut = (req, res) => {
  req.session.destroy();
  return res.redirect("/auth/login");
};

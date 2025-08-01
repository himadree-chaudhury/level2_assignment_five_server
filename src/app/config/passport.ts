import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/v1/user/user.model";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found." });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        if (user.isBlocked || user.isDeleted) {
          return done(null, false, { message: "User is blocked or deleted." });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// passport.serializeUser((user: any, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });

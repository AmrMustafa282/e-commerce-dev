import { AppError } from "../utils/appError.js";
import { catchAsync } from "./../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { promisify } from "util";
import { PrismaClient } from "@prisma/client";
import { Email } from "../utils/email.js";

const prisma = new PrismaClient();

const signToken = (user) => {
 return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
 });
};

const createSendToken = (user, statusCode, req, res) => {
 const token = signToken(user);
 res.cookie("jwt", token, {
  expires: new Date(
   Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
  secure: req.secure || req.headers["x-forwarded-proto"] === "https",
 });

 user.password = undefined;

 res.status(statusCode).json({
  status: "success",
  token,
  data: {
   user,
  },
 });
};
export const signup = catchAsync(async (req, res, next) => {
 const { username, email } = req.body;
 const password = await bcrypt.hash(req.body.password, 10);
 const newUser = await prisma.user.create({
  data: {
   username,
   email,
   password,
  },
 });
 newUser.password = undefined;

 //  const url = `${req.protocol}://${req.get("host")}/me`;
 //  await new Email(newUser, url).sendWelcome();

 res.status(200).json({
  status: "success",
  data: {
   newUser,
  },
 });
});

export const login = catchAsync(async (req, res, next) => {
 const { email, password } = req.body;

 if (!email || !password) {
  return next(new AppError("Please provide email and password!", 400));
 }
 const user = await prisma.user.findUnique({
  where: {
   email,
   },
   include: {
     orders: {
     include: {orderItems: true}
   }}
 });

 if (!user || !(await bcrypt.compare(password, user.password))) {
  return next(new AppError("Incorrect email or password", 401));
 }
 //  if (!user.isConfirmed) {
 //   return next(new AppError("We have sent virification to your email", 401));
 //  }

 createSendToken(user, 200, req, res);
});

export const logout = (req, res) => {
 res.cookie("jwt", "loggedout", {
  expires: new Date(Date.now() + 10 * 1000),
  httpOnly: true,
 });
 res.status(200).json({ status: "success" });
};

export const protect = catchAsync(async (req, res, next) => {
 // 1) Getting token and check of it's there
 let token;
 if (
  req.headers.authorization &&
  req.headers.authorization.startsWith("Bearer")
 ) {
  token = req.headers.authorization.split(" ")[1];
 } else if (req.cookies.jwt) {
  token = req.cookies.jwt;
 }

 if (!token) {
  return next(
   new AppError("You are not logged in! Please log in to get access.", 401)
  );
 }

 // 2) Verification token
 const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

 // 3) Check if user still exists
 const currentUser = await prisma.user.findUnique({
  where: { id: decoded.id },
 });

 if (!currentUser) {
  return next(
   new AppError("The user belonging to this token does no longer exist.", 401)
  );
 }

 // 4) Check if user changed password after the token was issued[LATER]

 // GRANT ACCESS TO PROTECTED ROUTE
 req.user = currentUser;
 res.locals.user = currentUser;
 next();
});

export const restrictTo = (...roles) => {
 return (req, res, next) => {
  if (!roles.includes(req.user.role)) {
   return next(
    new AppError("You do not have permission to perform this action", 403)
   );
  }

  next();
 };
};

export const updatePassword = catchAsync(async (req, res, next) => {
 // 1) Get user from collection
 const user = await prisma.user.findUnique({ where: { id: req.user.id } });
 let { password, newPassword } = req.body;
 // 2) Check if POSTed current password is correct
 if (!(await bcrypt.compare(password, user.password))) {
  return next(new AppError("Your current password is wrong.", 401));
 }

 // 3) If so, update password
 newPassword = await bcrypt.hash(password, 10);
 await prisma.user.update({
  where: {
   id: user.id,
  },
  data: {
   password: newPassword,
  },
 });
 user.password = undefined;
 createSendToken(user, 200, req, res);
});

export const forgotPassword = catchAsync(async (req, res, next) => {
 // 1) Get user based on POSTed email
 const user = await prisma.user.findUnique({
  where: { email: req.body.email },
 });
 if (!user) {
  return next(new AppError("There is no user with email address.", 404));
 }

 // 2) Generate the random reset token
 const resetToken = crypto.randomBytes(32).toString("hex");
 user.passwordResetToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
 user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
 await prisma.user.update({
  where: {
   email: req.body.email,
  },
  data: user,
 });

 // 3) Send it to user's email
 try {
  const resetURL = {
   url: `${req.protocol}://${req.get("host")}/auth/reset-password/`,
   token: resetToken,
  };
  await new Email(user, resetURL).sendPasswordRest();

  res.status(200).json({
   status: "success",
   message: "Token sent to email!",
  });
 } catch (err) {
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await prisma.user.update({
   where: {
    email: req.body.email,
   },
   data: user,
  });
  console.log(err);
  return next(
   new AppError("There was an error sending the email. Try again later!"),
   500
  );
 }
});

export const resetPassword = catchAsync(async (req, res, next) => {
 // 1) Get user based on the token
 const hashedToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");

 const user = await prisma.user.findFirst({
  where: {
   passwordResetToken: hashedToken,
   passwordResetExpires: {
    gt: new Date(),
   },
  },
 });

 // 2) If token has not expired, and there is user, set the new password
 if (!user) {
  return next(new AppError("Token is invalid or has expired", 400));
 }
 user.password = await bcrypt.hash(req.body.password, 10);
 user.passwordResetToken = undefined;
 user.passwordResetExpires = undefined;

 await prisma.user.update({
  where: {
   email: user.email,
  },
  data: user,
 });

 // 3) Update changedPasswordAt property for the user
 // 4) Log the user in, send JWT
 // createSendToken(user, 200, req, res);
 res.status(200).json({
  status: "success",
 });
});

export const sendConfirmation = catchAsync(async (req, res, next) => {
 // 1) Get user based on current user id
 // const user = await User.findOne({email:req.body.email});
 // if (!user) {
 //   return next(new AppError('There is no user with that email address', 404));
 // }
 const { user } = req;
 if (user.isConfirmed) {
  return next(new AppError("THIS USER IS ALREADY CONFIRMED", 400));
 }
 // 2) Generate the random reset token
 const confirmToken = crypto.randomBytes(32).toString("hex");
 user.emailConfirmToken = crypto
  .createHash("sha256")
  .update(confirmToken)
  .digest("hex");
 user.emailConfirmExpires = new Date(Date.now() + 10 * 60 * 1000);
 await prisma.user.update({
  where: {
   email: req.user.email,
  },
  data: user,
 });
 // 3) Send it to user's email
 const URL = {
  url: `${req.protocol}://${req.get(
   "host"
  )}/api/v1/users/confirmEmail/${confirmToken}`,
  host: `${req.protocol}://${req.get("host")}`,
 };

 // const message = `Confirm your email? Submit a POST request to: ${confirmURL}`;
 try {
  await new Email(user, URL).sendAccountConfirmation();
  res.status(200).json({
   status: "success",
   massage: "Token sent to email!",
  });
 } catch (err) {
  user.emailConfirmToken = undefined;
  user.emailConfirmExpires = undefined;
  await prisma.user.update({
   where: {
    email: req.body.email,
   },
   data: user,
  });

  return next(
   new AppError("There was an error sending the email,Try again later!", 500)
  );
 }
});

// not portectd for now but i think it should be
export const confirmEmail = catchAsync(async (req, res, next) => {
 // 1) Get user based on the token
 const hashedToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");
  const user = await prisma.user.findFirst({
   where: {
    emailConfirmToken: hashedToken,
    emailConfirmExpires: {
     gt: new Date(),
    },
   },
  });
 // 2) if token has not expired, and there is user, set the new password
 if (!user) {
  return next(new AppError("Token is invalid or has expired", 400));
 }
// console.log(user)
 user.isConfirmed = true;
 user.emailConfirmToken = undefined;
 user.emailConfirmExpires = undefined;
 await prisma.user.update({
  where: {
   email: user.email,
  },
  data: user,
 });
 // createSendToken(user, 200, req, res, 'account');
   res.redirect("/me");
  // res.json('done')
});
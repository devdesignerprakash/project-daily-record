import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./auth/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import seedAdmin from "../utils/seedAdmin.js";
import fitnessRouter from "./fitness/fitness.route.js";
import routePermitRouter from "./routePermit/routePermit.route.js";
import roadworthinessRouter from "./roadworthiness/roadworthiness.route.js";
import pollutionRouter from "./pollution/pollution.route.js";
import userRouter from "./user/user.route.js";
import mechanicalTestRouter from "./mechanicalTest/mechanicalTest.route.js";
import patakeRouter from "./patake/patake.route.js";
import starkayamRouter from "./starkayam/starkayam.route.js";
import monitoringRouter from "./monitoring/monitoring.route.js";
import transportRegistrationRouter from "./transportRegistration/transportRegistration.route.js";
import adminRouter from "./admin/admin.route.js";
dotenv.config();
const app = express();
app.use(express.json()); //json data
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); //url encoded data

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use("/api/auth", authRouter); //auth routes
app.use("/api/fitness", fitnessRouter); //fitness routes
app.use("/api/routePermit", routePermitRouter); //routePermit routes
app.use("/api/route-permit", routePermitRouter); //routePermit kebab-case route
app.use("/api/roadworthiness", roadworthinessRouter); //roadworthiness routes
app.use("/api/pollution", pollutionRouter); //pollution routes
app.use("/api/user", userRouter); //user management routes
app.use("/api/mechanical-test", mechanicalTestRouter); //यान्त्रिक परीक्षण routes
app.use("/api/patake", patakeRouter); //पटके routes
app.use("/api/starkayam", starkayamRouter); //स्तर कायम routes
app.use("/api/monitoring", monitoringRouter); //कारखाना वर्कसप अनुगमन routes
app.use("/api/transport-registration", transportRegistrationRouter); //यातायात सेवा पञ्जीकरण routes
app.use("/api/admin", adminRouter); //admin cross-module routes
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  seedAdmin();
  console.log(`Server is running on port ${PORT}`);
});

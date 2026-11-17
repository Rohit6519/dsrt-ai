import "dotenv/config";
import express from "express";
import cors from "cors";
import preRegisterRouter from "./routes/preRegister";
import enterpriseEnquiryRouter from "./routes/enterpriseEnquiry";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DSRT AI Backend is running",
  });
});

// Pre-registration API
app.use("/api/pre-register", preRegisterRouter);
app.use("/api/enterprise-enquiry", enterpriseEnquiryRouter);

// Start server
app.listen(PORT, () => {
  console.log(`DSRT AI Backend running on port ${PORT}`);
});

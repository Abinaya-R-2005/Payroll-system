const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- DB CONNECTION ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ---------- SCHEMA ---------- */
const employeeSchema = new mongoose.Schema(
  {
    role: { type: String, default: "employee" },

    fullName: String,
    dob: String,
    personalEmail: String,
    phone: String,
    address: String,
    taxStatus: String,

    accountName: String,
    accountNumber: String,
    bankCode: String,
    accountType: String,

    employeeId: String,
    jobTitle: String,
    department: String,
    joiningDate: String,
    workLocation: String,

    emergencyName: String,
    emergencyRel: String,
    emergencyPhone: String,
    consent: Boolean,

    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

/* ---------- REGISTER ---------- */
app.post("/register", async (req, res) => {
  try {
    const exists = await Employee.findOne({ email: req.body.email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const employee = new Employee({
      ...req.body,
      password: hashedPassword,
    });

    await employee.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- LOGIN ---------- */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Employee.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  res.json({
    message: "Login successful",
    role: user.role,
    employeeId: user.employeeId,
  });
});

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

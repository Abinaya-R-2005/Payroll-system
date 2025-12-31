const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    month: { type: String, required: true },
    days: {
      type: Map,
      of: {
        status: String, // P / A / L
        photo: String // base64 image data
      }
    }
  },
  { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);

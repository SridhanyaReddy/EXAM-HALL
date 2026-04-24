import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

// ===== CONNECT DB =====
const connectDB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
    } catch (error) {
        console.error("DB Connection Error:", error);
        throw new Error("Database connection failed");
    }
};

// ===== SCHEMA =====
const StudentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true },
    examHall: { type: String, required: true }
});

const Student =
    mongoose.models.Student ||
    mongoose.model("Student", StudentSchema);

// ===== HANDLER =====
export default async function handler(req, res) {
    // Allow only POST
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        // ===== TOKEN CHECK =====
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, "secretkey");

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        // ===== CONNECT DB =====
        await connectDB();

        const { rollNumber, examHall } = req.body;

        // ===== VALIDATION =====
        if (!rollNumber || !examHall) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ===== CHECK EXISTING =====
        const existing = await Student.findOne({ rollNumber });

        if (existing) {
            // Instead of duplicate, update it
            existing.examHall = examHall;
            await existing.save();

            return res.status(200).json({ message: "Updated successfully" });
        }

        // ===== CREATE NEW =====
        const student = new Student({ rollNumber, examHall });
        await student.save();

        return res.status(200).json({ message: "Added successfully" });

    } catch (err) {
        console.error("Error:", err);

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(500).json({ message: "Server error" });
    }
}

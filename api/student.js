import mongoose from "mongoose";

const MONGO_URI = "YOUR_MONGO_URI_HERE";

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
    rollNumber: { type: String, required: true },
    examHall: { type: String, required: true }
});

const Student =
    mongoose.models.Student ||
    mongoose.model("Student", StudentSchema);

// ===== HANDLER =====
export default async function handler(req, res) {
    // Allow only GET
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { roll } = req.query;

        // ===== VALIDATION =====
        if (!roll) {
            return res.status(400).json({ message: "Roll number is required" });
        }

        // ===== CONNECT DB =====
        await connectDB();

        // ===== FIND STUDENT =====
        const student = await Student.findOne({ rollNumber: roll });

        if (!student) {
            return res.status(200).json({ message: "Not found" });
        }

        return res.status(200).json({
            rollNumber: student.rollNumber,
            examHall: student.examHall
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

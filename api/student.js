import mongoose from "mongoose";

// ===== SCHEMA =====
const StudentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true },
    examHall: { type: String, required: true }
});

// Prevent model overwrite in dev
const Student =
    mongoose.models.Student || mongoose.model("Student", StudentSchema);

// ===== DB CONNECTION =====
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    return mongoose.connect(process.env.MONGO_URI);
};

export default async function handler(req, res) {
    // Only GET allowed
    if (req.method !== "GET") {
        return res.status(405).json({
            message: "Method not allowed"
        });
    }

    try {
        await connectDB();

        const { roll } = req.query;

        if (!roll) {
            return res.status(400).json({
                message: "Roll number is required"
            });
        }

        const student = await Student.findOne({
            rollNumber: roll
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.status(200).json({
            rollNumber: student.rollNumber,
            examHall: student.examHall
        });

    } catch (error) {
        console.error("Student API Error:", error);

        return res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
}

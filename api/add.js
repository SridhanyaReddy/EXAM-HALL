import mongoose from "mongoose";

// ===== SCHEMA =====
const StudentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true },
    examHall: { type: String, required: true }
});

const Student =
    mongoose.models.Student || mongoose.model("Student", StudentSchema);

// ===== CONNECT DB (IMPORTANT) =====
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;

    return mongoose.connect(process.env.MONGO_URL);
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        await connectDB();

        const { rollNumber, examHall } = req.body;

        if (!rollNumber || !examHall) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newStudent = new Student({ rollNumber, examHall });
        await newStudent.save();

        return res.status(200).json({
            message: "Student added successfully"
        });

    } catch (error) {
        console.error("Add API Error:", error);

        return res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
}

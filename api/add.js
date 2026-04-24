import mongoose from 'mongoose';

// ===== SCHEMA DEFINITION =====
const StudentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true },
    examHall: { type: String, required: true }
});

// ===== MODEL INITIALIZATION =====
// Prevent re-compiling the model during hot reloads in development
const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

export default async function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
    const res = await fetch("/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, examHall })
    });

    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        msg.innerText = data.message || (res.ok ? "Success" : "Error");
    } else {
        // This catches the "A server error..." text and shows it to you
        const rawText = await res.text();
        console.error("Server returned non-JSON response:", rawText);
        msg.innerText = "Backend Error: " + rawText.substring(0, 50);
    }
} catch (error) {
    console.error("Network/Parsing Error:", error);
    msg.innerText = "Check your internet or console.";
}
    }

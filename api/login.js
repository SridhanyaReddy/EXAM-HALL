import jwt from "jsonwebtoken";

export default function handler(req, res) {
    // Allow only POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hardcoded admin credentials
        if (username === "admin" && password === "1234") {
            const token = jwt.sign(
                { role: "admin" },
                "secretkey",
                { expiresIn: "1h" }
            );

            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (username === "admin" && password === "1234") {
            return res.status(200).json({
                message: "Login successful",
                auth: true
            });
        }

        return res.status(401).json({
            message: "Invalid credentials",
            auth: false
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

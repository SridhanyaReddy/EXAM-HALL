export default function handler(req, res) {
    // 1. Only allow POST requests for login
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { username, password } = req.body;

        // 2. Simple Validation
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 3. Hardcoded admin credentials
        // Username: admin | Password: 1234
        if (username === "admin" && password === "1234") {
            // Returning 'auth: true' triggers the admin-section to show on the frontend
            return res.status(200).json({ 
                message: "Login successful", 
                auth: true 
            });
        } else {
            // 4. Handle failed login
            return res.status(401).json({ message: "Invalid username or password" });
        }

    } catch (error) {
        console.error("Login API Error:", error);
        
        // This ensures if something breaks, it still returns JSON, avoiding the "Token A" error
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
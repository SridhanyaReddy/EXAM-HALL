// ================= SAFE JSON HELPER =================
async function safeJson(res) {
    try {
        return await res.json();
    } catch (e) {
        return null;
    }
}

// ================= LOGIN FUNCTION =================
async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    if (!username || !password) {
        msg.innerText = "Please enter all fields";
        return;
    }

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await safeJson(res);

        if (!data) {
            msg.innerText = "Server error: invalid response";
            return;
        }

        if (res.ok && data.auth) {
            localStorage.setItem("isLoggedIn", "true");
            msg.innerText = "Login successful!";
            checkAuth();
        } else {
            msg.innerText = data.message || "Invalid Credentials";
        }

    } catch (error) {
        console.error("Login Error:", error);
        msg.innerText = "Server error. Try again.";
    }
}


// ================= ADD STUDENT FUNCTION =================
async function addStudent() {
    const rollNumber = document.getElementById("rollNumber").value.trim();
    const examHall = document.getElementById("examHall").value.trim();
    const msg = document.getElementById("msg");

    if (!rollNumber || !examHall) {
        msg.innerText = "Please fill all fields";
        return;
    }

    try {
        const res = await fetch("/api/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rollNumber, examHall })
        });

        const data = await safeJson(res);

        if (!data) {
            msg.innerText = "Server error: invalid response";
            return;
        }

        if (res.ok) {
            msg.innerText = "Student added successfully!";
            document.getElementById("rollNumber").value = "";
            document.getElementById("examHall").value = "";
        } else {
            msg.innerText = data.message || "Failed to add student";
        }

    } catch (error) {
        console.error("Add Student Error:", error);
        msg.innerText = "Error adding student.";
    }
}


// ================= LOGOUT FUNCTION =================
function logout() {
    localStorage.removeItem("isLoggedIn");
    checkAuth();
    document.getElementById("msg").innerText = "Logged out.";
}


// ================= UI TOGGLE =================
function checkAuth() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const adminSection = document.querySelector(".admin-section");
    const loginHeader = document.querySelector("h2");

    const loginElements = [
        document.getElementById("username"),
        document.getElementById("password"),
        document.querySelector("button[onclick='login()']")
    ];

    if (isLoggedIn === "true") {
        if (adminSection) adminSection.style.display = "block";
        if (loginHeader) loginHeader.style.display = "none";
        loginElements.forEach(el => { if (el) el.style.display = "none"; });
    } else {
        if (adminSection) adminSection.style.display = "none";
        if (loginHeader) loginHeader.style.display = "block";
        loginElements.forEach(el => { if (el) el.style.display = "block"; });
    }
}

window.onload = checkAuth;

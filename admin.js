// ===== LOGIN =====
async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    // Validation
    if (!username || !password) {
        msg.innerText = "Please enter username and password";
        return;
    }

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok && data.token) {
            localStorage.setItem("token", data.token);
            msg.innerText = "Login successful";

            // Show admin section after login
            document.querySelector(".admin-section").style.display = "block";
        } else {
            msg.innerText = data.message || "Login failed";
        }
    } catch (error) {
        console.error(error);
        msg.innerText = "Server error. Try again.";
    }
}


// ===== ADD / UPDATE STUDENT =====
async function addStudent() {
    const rollNumber = document.getElementById("rollNumber").value.trim();
    const examHall = document.getElementById("examHall").value.trim();
    const msg = document.getElementById("msg");

    // Validation
    if (!rollNumber || !examHall) {
        msg.innerText = "Please enter all fields";
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        msg.innerText = "Please login first";
        return;
    }

    try {
        const res = await fetch("/api/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ rollNumber, examHall })
        });

        const data = await res.json();

        if (res.ok) {
            msg.innerText = data.message || "Success";

            // Clear inputs after success
            document.getElementById("rollNumber").value = "";
            document.getElementById("examHall").value = "";
        } else {
            msg.innerText = data.message || "Failed";
        }

    } catch (error) {
        console.error(error);
        msg.innerText = "Server error. Try again.";
    }
}


// ===== HIDE ADMIN SECTION INITIALLY =====
window.onload = () => {
    const token = localStorage.getItem("token");
    const adminSection = document.querySelector(".admin-section");

    if (token) {
        adminSection.style.display = "block";
    } else {
        adminSection.style.display = "none";
    }
};

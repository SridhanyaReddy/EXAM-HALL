// ===== ADD / UPDATE STUDENT =====
async function addStudent() {
    const rollNumber = document.getElementById("rollNumber").value.trim();
    const examHall = document.getElementById("examHall").value.trim();
    const msg = document.getElementById("msg");

    // Clear previous message
    msg.innerText = "";

    // ===== VALIDATION =====
    if (!rollNumber || !examHall) {
        msg.innerText = "Please enter all fields";
        return;
    }

    // ===== GET TOKEN =====
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
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ rollNumber, examHall })
        });

        const data = await res.json();

        if (res.ok) {
            msg.innerText = data.message || "Student added successfully";

            // Clear inputs after success
            document.getElementById("rollNumber").value = "";
            document.getElementById("examHall").value = "";
        } else {
            msg.innerText = data.message || "Failed to add student";
        }

    } catch (error) {
        console.error("Add Student Error:", error);
        msg.innerText = "Server error. Try again.";
    }
}

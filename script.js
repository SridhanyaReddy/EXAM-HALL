async function findHall() {
    const rollInput = document.getElementById("roll");
    const result = document.getElementById("result");

    const roll = rollInput.value.trim();

    // Check empty input
    if (!roll) {
        result.innerText = "Please enter a roll number";
        return;
    }

    try {
        const res = await fetch(`/api/student?roll=${encodeURIComponent(roll)}`);

        // ✅ SAFE JSON PARSE
        let data;
        try {
            data = await res.json();
        } catch (e) {
            console.error("Invalid JSON response from server");
            result.innerText = "Server error: invalid response";
            return;
        }

        if (res.ok) {
            if (data.examHall) {
                result.innerText = "Exam Hall: " + data.examHall;
            } else {
                result.innerText = data.message || "Roll number not found";
            }
        } else {
            result.innerText = data.message || "Student not found";
        }

    } catch (error) {
        console.error(error);
        result.innerText = "Something went wrong. Try again.";
    }
}

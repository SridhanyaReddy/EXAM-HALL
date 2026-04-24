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
        const data = await res.json();

        if (data.examHall) {
            result.innerText = "Exam Hall: " + data.examHall;
        } else {
            result.innerText = "Roll number not found";
        }
    } catch (error) {
        console.error(error);
        result.innerText = "Something went wrong. Try again.";
    }
}

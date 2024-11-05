const apiUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // Replace with your Google Apps Script URL
const maxSlots = 10;

// Function to get the selected date
function getSelectedDate() {
    const dateInput = document.getElementById("date").value;
    return dateInput ? dateInput.replace(/-/g, '') : ""; // Format as YYYYMMDD for sheet names
}

// Function to fetch current signups for the selected date
async function fetchSignups() {
    const date = getSelectedDate();
    if (!date) return; // Prevent fetch if date is empty
    const response = await fetch(`${apiUrl}?action=get&date=${date}`);
    const signups = await response.json();
    updateDisplay(signups);
}

// Function to add a new signup
async function signUp() {
    const name = document.getElementById("name").value.trim();
    const date = getSelectedDate();
    if (!name || !date) return;
    const response = await fetch(`${apiUrl}?action=signup&name=${encodeURIComponent(name)}&date=${date}`);
    const signups = await response.json();
    updateDisplay(signups);
}

// Function to remove a signup
async function removeSignup(name) {
    const date = getSelectedDate();
    const response = await fetch(`${apiUrl}?action=remove&name=${encodeURIComponent(name)}&date=${date}`);
    const signups = await response.json();
    updateDisplay(signups);
}

// Update display function to reflect changes in signups
function updateDisplay(signups) {
    const remainingSlots = maxSlots - signups.length;
    document.getElementById("remainingSlots").textContent = remainingSlots;
    const signupList = document.getElementById("signupList");
    signupList.innerHTML = "";

    signups.forEach(name => {
        const listItem = document.createElement("li");
        listItem.textContent = name;
        
        // Add a remove button for each signup
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeSignup(name);
        listItem.appendChild(removeButton);

        signupList.appendChild(listItem);
    });

    document.getElementById("signUpBtn").disabled = remainingSlots <= 0;
    document.getElementById("name").value = "";
}

// Initialize display on date change
document.getElementById("date").addEventListener("change", fetchSignups);
window.onload = fetchSignups;

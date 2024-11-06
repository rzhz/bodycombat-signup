const apiUrl = 'https://script.google.com/macros/s/AKfycby2L0PHVfqOlShkqtN98to-HXV9rrhnoDBi2_-lzqYxf1yCkrchj35riCN3OOPa5nIK2g/exec'; // Replace with your Google Apps Script URL
const maxSlots = 15;

// Manually set the event date here (format: YYYYMMDD)
const eventDate = '20241107'; // Example date: November 13, 2024

// Display the event date on the page
document.getElementById('eventDate').textContent = 'Thursday November 07, 2024'; // Adjust the displayed date as needed

// Function to fetch current signups for the set date
async function fetchSignups() {
    const response = await fetch(`${apiUrl}?action=get&date=${eventDate}`);
    const signups = await response.json();
    updateDisplay(signups);
}

// Function to add a new signup
async function signUp() {
    const name = document.getElementById("name").value.trim();
    if (!name) return;
    const response = await fetch(`${apiUrl}?action=signup&name=${encodeURIComponent(name)}&date=${eventDate}`);
    const signups = await response.json();
    updateDisplay(signups);
}


// Function to remove a signup
async function removeSignup(name) {
    const response = await fetch(`${apiUrl}?action=remove&name=${encodeURIComponent(name)}&date=${eventDate}`);
    const signups = await response.json();
    updateDisplay(signups);
}

console.log('Event Date:', eventDate);

// Update display function remains the same
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

// Initialize display on page load
window.onload = fetchSignups;

const apiUrl = 'https://script.google.com/macros/s/AKfycbyVgC-q4qmYvQ0sXIH9qnpRwo-x0i_EQ3wAWWEeQJOxyfb922Dbcl7vE1U3_NKdfwX12A/exec'; // Replace with your Google Apps Script URL
const maxSlots = 15;

// Manually set the event date here (format: YYYYMMDD)
const eventDate = '20241107'; // Example date: November 13, 2024

// Convert eventDate (YYYYMMDD) to a readable format and display it
const eventDateObj = new Date(
    parseInt(eventDate.slice(0, 4)), // Year
    parseInt(eventDate.slice(4, 6)) - 1, // Month (0-indexed)
    parseInt(eventDate.slice(6, 8)) // Day
);

// Format the date to a readable string
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formattedEventDate = eventDateObj.toLocaleDateString(undefined, options);

// Display the formatted event date on the page
document.getElementById('eventDate').textContent = formattedEventDate;
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

    const fragment = document.createDocumentFragment();
    signups.forEach(name => {
        const listItem = document.createElement("li");
        listItem.textContent = name;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeSignup(name);
        listItem.appendChild(removeButton);

        fragment.appendChild(listItem);
    });
    signupList.appendChild(fragment);

    document.getElementById("signUpBtn").disabled = remainingSlots <= 0;
    document.getElementById("name").value = "";
}

// Initialize display on page load
window.onload = fetchSignups;

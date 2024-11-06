const apiUrl = 'https://script.google.com/macros/s/AKfycbyVgC-q4qmYvQ0sXIH9qnpRwo-x0i_EQ3wAWWEeQJOxyfb922Dbcl7vE1U3_NKdfwX12A/exec'; // Google Apps Script URL
const maxSlots = 15;

// Set the event date here (format: YYYYMMDD)
const eventDate = '20241107';

// Convert eventDate (YYYYMMDD) to a readable format and display it
const eventDateObj = new Date(
    parseInt(eventDate.slice(0, 4)), // Year
    parseInt(eventDate.slice(4, 6)) - 1, // Month (0-indexed)
    parseInt(eventDate.slice(6, 8)) // Day
);
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formattedEventDate = eventDateObj.toLocaleDateString(undefined, options);
document.getElementById('eventDate').textContent = formattedEventDate;

// Fetch current signups for the set date
async function fetchSignups() {
    try {
        const response = await fetch(`${apiUrl}?action=get&date=${eventDate}`);
        const signups = await response.json();
        console.log('Signups data:', signups); // Log the signups data to inspect
        updateDisplay(signups);
    } catch (error) {
        console.error('Error fetching signups:', error);
    }
}

// Add a new signup
async function signUp() {
    const name = document.getElementById("name").value.trim();
    if (!name) return;

    const userId = Date.now() + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('currentUserId', userId);
    localStorage.setItem('currentUserName', name);

    try {
        const response = await fetch(`${apiUrl}?action=signup&name=${encodeURIComponent(name)}&userId=${userId}&date=${eventDate}`);
        const signups = await response.json();
        updateDisplay(signups);
    } catch (error) {
        console.error('Error signing up:', error);
    }
}

// Remove a signup (unconditionally)
async function removeSignup(name) {
    try {
        const response = await fetch(`${apiUrl}?action=remove&name=${encodeURIComponent(name)}&date=${eventDate}`);
        const signups = await response.json();
        updateDisplay(signups);
    } catch (error) {
        console.error('Error removing signup:', error);
    }
}

// Update the display of signups (unconditionally show Remove button)
function updateDisplay(signups) {
    const remainingSlots = maxSlots - signups.length;
    document.getElementById("remainingSlots").textContent = remainingSlots;
    const signupList = document.getElementById("signupList");
    signupList.innerHTML = "";

    signups.forEach(({ name }) => {
        console.log('Processing name:', name); // Debug: Log each name being processed

        // Create list item
        const listItem = document.createElement("li");
        listItem.classList.add("signup-item");

        // Create span for the name and set text content
        const nameSpan = document.createElement("span");
        nameSpan.textContent = name || "No name available"; // Add a fallback in case name is empty
        listItem.appendChild(nameSpan);

        // Create the "Remove" button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-button");
        removeButton.onclick = () => removeSignup(name);

        // Append the button to the list item
        listItem.appendChild(removeButton);

        // Append the list item to the signup list
        signupList.appendChild(listItem);
    });

    document.getElementById("signUpBtn").disabled = remainingSlots <= 0;
    document.getElementById("name").value = "";
}

// Initialize display on page load
window.onload = fetchSignups;

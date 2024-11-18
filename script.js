const apiUrl = 'https://script.google.com/macros/s/AKfycbyVgC-q4qmYvQ0sXIH9qnpRwo-x0i_EQ3wAWWEeQJOxyfb922Dbcl7vE1U3_NKdfwX12A/exec'; // Google Apps Script URL
const maxSlots = 15;
const eventDate = '20241120';

// Convert eventDate (YYYYMMDD) to a readable format and display it
const eventDateObj = new Date(
    parseInt(eventDate.slice(0, 4)),
    parseInt(eventDate.slice(4, 6)) - 1,
    parseInt(eventDate.slice(6, 8))
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

// Remove a signup
async function removeSignup(name) {
    const userId = localStorage.getItem('currentUserId');
    const currentUserName = localStorage.getItem('currentUserName');

    if (!userId || name !== currentUserName) {
        alert("You can't remove this sign-up as it's not associated with this device.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}?action=remove&name=${encodeURIComponent(name)}&userId=${userId}&date=${eventDate}`);
        const signups = await response.json();
        updateDisplay(signups);
    } catch (error) {
        console.error('Error removing signup:', error);
    }
}

// Update the display of signups with conditional "Remove" button
function updateDisplay(signups) {
    const remainingSlots = maxSlots - signups.length;
    document.getElementById("remainingSlots").textContent = remainingSlots;
    const signupList = document.getElementById("signupList");
    signupList.innerHTML = "";

    // Retrieve the current user's ID from local storage
    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserName = localStorage.getItem('currentUserName');

    signups.forEach((name) => {
        console.log('Processing name:', name); // Debug: Log each name for verification

        // Create list item
        const listItem = document.createElement("li");
        listItem.classList.add("signup-item");

        // Create span for the name and set text content
        const nameSpan = document.createElement("span");
        nameSpan.textContent = name;
        listItem.appendChild(nameSpan);

        // Show "Remove" button only if this entry matches the current user's name
        if (name === currentUserName) {
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.classList.add("remove-button");
            removeButton.onclick = () => removeSignup(name);
            listItem.appendChild(removeButton);
        }

        // Append the list item to the signup list
        signupList.appendChild(listItem);
    });

    document.getElementById("signUpBtn").disabled = remainingSlots <= 0;
    document.getElementById("name").value = "";
}

// Initialize display on page load
window.onload = fetchSignups;

const apiUrl = 'https://script.google.com/macros/s/AKfycbyVgC-q4qmYvQ0sXIH9qnpRwo-x0i_EQ3wAWWEeQJOxyfb922Dbcl7vE1U3_NKdfwX12A/exec'; // Google Apps Script URL
const maxSlots = 16;
const eventDate = '20250515';

// Convert eventDate (YYYYMMDD) to a readable format and display it
const eventDateObj = new Date(
    parseInt(eventDate.slice(0, 4)),
    parseInt(eventDate.slice(4, 6)) - 1,
    parseInt(eventDate.slice(6, 8))
);
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formattedEventDate = eventDateObj.toLocaleDateString(undefined, options);
document.getElementById('eventDate').textContent = formattedEventDate;

let signupsLoaded = false;

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
    if (!signupsLoaded) {
        alert("Please wait for the sign-up list to load.");
        return;
    }

    const name = document.getElementById("name").value.trim();
    if (!name) return;

    // Get existing signups or create empty object
    let deviceSignups = JSON.parse(localStorage.getItem(`signups_${eventDate}`) || '{}');

    if (deviceSignups[name]) {
        alert("You have already signed up with this name on this device.");
        return;
    }

    const userId = Date.now() + Math.random().toString(36).substr(2, 9);
    deviceSignups[name] = userId;
    localStorage.setItem(`signups_${eventDate}`, JSON.stringify(deviceSignups));

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
    let deviceSignups = JSON.parse(localStorage.getItem(`signups_${eventDate}`) || '{}');
    const userId = deviceSignups[name];

    if (!userId) {
        alert("You can't remove this sign-up as it's not associated with this device.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}?action=remove&name=${encodeURIComponent(name)}&userId=${userId}&date=${eventDate}`);
        const signups = await response.json();

        // Remove from local storage on success
        delete deviceSignups[name];
        localStorage.setItem(`signups_${eventDate}`, JSON.stringify(deviceSignups));

        updateDisplay(signups);
    } catch (error) {
        console.error('Error removing signup:', error);
    }
}


// Update the display of signups with conditional "Remove" button
function updateDisplay(signups) {
    signupsLoaded = true;

    const remainingSlots = maxSlots - signups.length;
    document.getElementById("remainingSlots").textContent = remainingSlots;
    const signupList = document.getElementById("signupList");
    signupList.innerHTML = "";

    const deviceSignups = JSON.parse(localStorage.getItem(`signups_${eventDate}`) || '{}');
    
    signups.forEach(({ name, userId }) => {
        const listItem = document.createElement("li");
        listItem.classList.add("signup-item");

        const nameSpan = document.createElement("span");
        nameSpan.textContent = name;
        listItem.appendChild(nameSpan);

        if (deviceSignups[name] === userId) {
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.classList.add("remove-button");
            removeButton.onclick = () => removeSignup(name);
            listItem.appendChild(removeButton);
        }

        signupList.appendChild(listItem);
    });

    // Enable button only if there are slots
    document.getElementById("signUpBtn").disabled = remainingSlots <= 0;
    document.getElementById("loadingMsg")?.remove(); // Remove loading text

}


// Initialize display on page load
window.onload = fetchSignups;

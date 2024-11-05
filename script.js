// Set the maximum number of slots available
const maxSlots = 10;
let signups = []; // Array to store sign-up names

// Function to update the displayed remaining slots and signup list
function updateDisplay() {
    const remainingSlots = maxSlots - signups.length;
    document.getElementById("remainingSlots").textContent = remainingSlots;
    const signupList = document.getElementById("signupList");
    signupList.innerHTML = "";
    signups.forEach(name => {
        const listItem = document.createElement("li");
        listItem.textContent = name;
        signupList.appendChild(listItem);
    });
    
    // Disable the sign-up button if slots are full
    document.getElementById("signUpBtn").disabled = remainingSlots <= 0;
}

// Function to handle sign-up
function signUp() {
    const name = document.getElementById("name").value.trim();
    if (name && signups.length < maxSlots) {
        signups.push(name); // Add name to sign-ups list
        document.getElementById("name").value = ""; // Clear input field
        updateDisplay(); // Refresh display
    }
}

// Initialize display on page load
window.onload = updateDisplay;

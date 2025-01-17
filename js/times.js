// Fetch data from the JSON file
async function fetchData() {
    const response = await fetch('data/times.json');
    return await response.json();
}

// Save updated data to the JSON file (mock function - backend needed to persist changes)
async function saveData(updatedData) {
    console.log("Data to save:", updatedData);
    alert("Changes saved! (Backend integration required to persist changes.)");
}

// Populate the category dropdown
async function populateCategories() {
    const data = await fetchData();
    const categorySelect = document.getElementById("category");

    for (const category in data) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    }

    categorySelect.addEventListener("change", () => loadTimes(data));
    loadTimes(data);
}

// Load times for the selected category
function loadTimes(data) {
    const category = document.getElementById("category").value;
    const timesContainer = document.getElementById("timesContainer");

    // Clear existing cards
    timesContainer.innerHTML = "";

    if (!data[category]) {
        alert("No data available for this category.");
        return;
    }

    // Create time cards
    data[category].forEach((entry, index) => {
        const card = document.createElement("div");
        card.classList.add("time-card");

        card.innerHTML = `
            <div class="time-info">
                <span>Time: ${entry.time}</span>
                <small>Date: ${entry.date}</small>
            </div>
            <div class="actions">
                <i class="fa fa-pen edit" data-index="${index}"></i>
                <i class="fa fa-trash delete" data-index="${index}"></i>
            </div>
        `;

        timesContainer.appendChild(card);
    });

    // Attach event listeners for actions
    const editButtons = document.querySelectorAll(".edit");
    const deleteButtons = document.querySelectorAll(".delete");

    editButtons.forEach((button) => {
        button.addEventListener("click", () => editEntry(data, category, button.dataset.index));
    });

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => deleteEntry(data, category, button.dataset.index));
    });
}

// Edit an entry
function editEntry(data, category, index) {
    const newTime = prompt("Enter new time:", data[category][index].time);
    const newDate = prompt("Enter new date:", data[category][index].date);

    if (newTime && newDate) {
        data[category][index].time = newTime;
        data[category][index].date = newDate;

        // Save updated data (mock function)
        saveData(data);

        // Reload the cards
        loadTimes(data);
    }
}

// Delete an entry
function deleteEntry(data, category, index) {
    if (confirm("Are you sure you want to delete this entry?")) {
        data[category].splice(index, 1);

        // Save updated data (mock function)
        saveData(data);

        // Reload the cards
        loadTimes(data);
    }
}

// Initialize the page
async function init() {
    await populateCategories();
}

// Start the app
window.onload = init;
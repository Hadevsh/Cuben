async function fetchAllData() {
    try {
        const pllResponse = await fetch('src/images/PLL/PLL.json');
        const pllData = await pllResponse.json();
        generateCards("pll", pllData);
        const ollResponse = await fetch('src/images/OLL/OLL.json');
        const ollData = await ollResponse.json();
        generateCards("oll", ollData);
    } catch (error) {
        console.error("Error loading algorithm data:", error);
    }
}

function generateCards(containerId, data) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    
    Object.entries(data).forEach(([key, value]) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="src/images/${containerId}/${key}.png" alt="${key}">
            <h3>${key} <span style="color: var(--darker-foreground); font-size: 15px;">${value.group}<span></h3>
            <p>${value.algorithms[0]}</p>
            <div class="options">
                <i class="fa fa-star-o"></i>
                <i class="fa fa fa-check"></i>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function updateCardsPerRow() {
    const cardsPerRow = document.getElementById("cards-row").value;

    // Save to localStorage
    localStorage.setItem("cards-row", cardsPerRow);

    // Update layout
    const containers = document.querySelectorAll("#pll, #oll, #starred, #cfop");
    containers.forEach(container => {
        const dropdown = document.getElementById(`dropdown-${container.id}`);

        // All sections hidden by default (cache saving later)
        container.style.display = `none`;
        console.log(container.style.display);
        dropdown.addEventListener("click", () => {
            if (container.style.display === `none`) {
                dropdown.style.transform = `rotate(180deg)`;
                container.style.display = `grid`;
                if (container.id === "cfop") { container.style.display = `block`; }
            }
            else {
                dropdown.style.transform = `rotate(0deg)`;
                container.style.display = `none`;
            }
        })
        container.style.gridTemplateColumns = `repeat(${cardsPerRow}, 1fr)`;
    });
}

function initializeCardsPerRow() {
    // Load from localStorage
    const cachedValue = localStorage.getItem("cards-row");

    if (cachedValue) {
        // Set input value and update layout
        const cardsRowInput = document.getElementById("cards-row");
        cardsRowInput.value = cachedValue;
        updateCardsPerRow(); // apply the layout with the cached value
    }
}

// Attach event listener after DOM loads
window.addEventListener("DOMContentLoaded", () => {
    const cardsRowInput = document.getElementById("cards-row");

    // Set up input listener
    cardsRowInput.addEventListener("change", updateCardsPerRow);

    // Initialize value from cache
    initializeCardsPerRow();
});

fetchAllData();
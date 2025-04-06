async function fetchAllData() {
    try {
        const pllResponse = await fetch('src/images/PLL/PLL.json');
        const pllData = await pllResponse.json();
        generateCards("pll", pllData);
        const ollResponse = await fetch('src/images/OLL/OLL.json');
        const ollData = await ollResponse.json();
        generateCards("oll", ollData);
        fetchStarredComplete();
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
            <h3>${key} <span style="color: var(--darker-foreground); font-size: 15px;">${value.group}</span></h3>
            <p>${value.algorithms[0]}</p>
            <div class="options">
                <i class="fa fa-star-o" id="star-${key}"></i>
                <i class="fa fa-check" id="complete-${key}"></i>
            </div>
        `;
        
        // Add click event listener for the star icon
        const star = card.querySelector(`#star-${key}`);
        star.addEventListener("click", () => {
            console.log(`Star clicked for ${key}`);
        });
        
        // Add click event listener for the complete icon
        const complete = card.querySelector(`#complete-${key}`);
        complete.addEventListener("click", () => {
            console.log(`Complete clicked for ${key}`);
        });
        
        container.appendChild(card);
    });
}

function updateCardsPerRow() {
    const cardsPerRow = document.getElementById("cards-row").value;

    // Save to localStorage
    localStorage.setItem("cards-row", cardsPerRow);

    // Update layout
    const containers = document.querySelectorAll("#pll, #oll, #starred, #complete, #cfop");
    containers.forEach(container => {
        const dropdown = document.getElementById(`dropdown-${container.id}`);

        // All sections hidden by default (cache saving later)
        container.style.display = `none`;
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

// Function do fetch starred and complete algorithms and display them
function fetchStarredComplete() {
    const starredDiv = document.getElementById('starred');
    const completeDiv = document.getElementById('complete');

    fetch('http://localhost:3000/algorithms')
    .then(response => response.json())
    .then(algorithms => {
        const starredPll = algorithms["starred"]["PLL"];
        const completePll = algorithms["complete"]["OLL"];
        
        const starredOll = algorithms["starred"]["PLL"];
        const completeOll = algorithms["complete"]["OLL"];

        if (starredPll.length === 0 && starredOll.length === 0) {
            starredDiv.innerHTML = `Nothing starred yet.`;
        } else {
            // TODO: Generate starred cards
        }

        if (completePll.length === 0 && completeOll.length === 0) {
            completeDiv.innerHTML = `Nothing marked as complete yet.`;
        } else {
            // TODO: Generate complete cards
        }
    });
}

// Attach event listener after DOM loads
window.addEventListener("DOMContentLoaded", () => {
    const cardsRowInput = document.getElementById("cards-row");

    // Set up input listener
    cardsRowInput.addEventListener("change", updateCardsPerRow);

    // Initialize value from cache
    initializeCardsPerRow();
});

document.addEventListener('DOMContentLoaded', function() {
    fetchAllData();
});
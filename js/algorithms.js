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
        `;
        
        container.appendChild(card);
    });
}

function updateCardsPerRow() {
    const cardsPerRow = document.getElementById("cards-row").value;
    const pllContainer = document.getElementById('pll');
    const ollContainer = document.getElementById('oll');

    pllContainer.setAttribute('style', `grid-template-columns: repeat(${cardsPerRow}, 1fr)`);
    ollContainer.setAttribute('style', `grid-template-columns: repeat(${cardsPerRow}, 1fr)`);
}

const cardsRowInput = document.getElementById("cards-row");
cardsRowInput.addEventListener("change", updateCardsPerRow);

fetchAllData();
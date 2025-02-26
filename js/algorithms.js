async function fetchAllData() {
    try {
        const pllResponse = await fetch('src/PLL/PLL.json');
        const pllData = await pllResponse.json();
        generateCards("pll", pllData);
    } catch (error) {
        console.error("Error loading PLL data:", error);
    }
}

function generateCards(containerId, data) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    
    Object.entries(data).forEach(([key, value]) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="src/${containerId}/${key}.png" alt="${key}">
            <h3>${key} <span style="color: var(--darker-foreground); font-size: 15px;">${value.group}<span></h3>
            <p>${value.algorithms[0]}</p>
        `;
        
        container.appendChild(card);
    });
}

fetchAllData();
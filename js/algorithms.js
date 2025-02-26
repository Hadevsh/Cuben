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
        
        const img = document.createElement("img");
        img.src = `src/${containerId}/${key}.png`;
        img.alt = key;
        
        const title = document.createElement("h3");
        title.textContent = key;
        
        const algorithm = document.createElement("p");
        algorithm.textContent = value.algorithms[0];
        
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(algorithm);
        container.appendChild(card);
    });
}

fetchAllData();
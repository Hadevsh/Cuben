/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("sidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "150px";
    document.getElementById("opennav").style.opacity = "0%";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("opennav").style.opacity = "100%";
}

const imageContainer = document.querySelector('.image');
const hoverText = document.querySelector('.hover-text');

imageContainer.addEventListener('mousemove', (e) => {
    const x = e.clientX - imageContainer.offsetLeft;
    const y = e.clientY - imageContainer.offsetTop;
    hoverText.style.left = `${x}px`;
    hoverText.style.top = `${y + 15}px`;
});

function updateTheme() {
    fetch('http://localhost:3000/settings')
    .then(response => response.json())
    .then(settings => {
        let styleSheets = document.styleSheets; // Get all stylesheets

        let name = settings.theme;

        let background = null;
        let nav_background = null;
        let darker_background = null;
        let text = null;
        let foreground = null;
        let darker_foreground = null;

        if (name === "dark") { // Dark Theme
            background = "#202020";
            nav_background = "#1b1b1b";
            darker_background = "#0f0f0f";
            text = "#fff";
            foreground = "#bbbbbb";
            darker_foreground = "#797979";
        }

        // Loop through stylesheets
        for (let sheet of styleSheets) {
            if (sheet.href && sheet.href.includes('style.css')) { 
                for (let rule of sheet.cssRules) {
                    if (rule.selectorText === ':root') {
                        rule.style.setProperty('--background', background);
                        rule.style.setProperty('--nav-background', nav_background);
                        rule.style.setProperty('--darker-background', darker_background);
                        rule.style.setProperty('--text', text);
                        rule.style.setProperty('--foreground', foreground);
                        rule.style.setProperty('--darker-foreground', darker_foreground);
                    }
                }
            }
        }
    })
}
document.addEventListener("DOMContentLoaded", updateTheme());

openNav();
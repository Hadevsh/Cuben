/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("sidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "150px";
    document.getElementById("opennav").style.opacity = "0%";
    document.getElementById("footer").style.marginLeft = "-150px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("opennav").style.opacity = "100%";
    document.getElementById("footer").style.marginLeft = "0px";
}

export function updateTheme() {
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
        else if (name === "light") {
            background = "#f5f5f5";
            nav_background = "#eaeaea";
            darker_background = "#dcdcdc";
            text = "#202020";
            foreground = "#4a4a4a";
            darker_foreground = "#797979";
        }
        else if (name === "ocean") {
            background = "#0a1f33";
            nav_background = "#081828";
            darker_background = "#040d14";
            text = "#f1faff";
            foreground = "#a8c6e6";
            darker_foreground = "#5f7e99";
        }
        else if (name === "sunset") {
            background = "#3d220f";
            nav_background = "#2b1b0f";
            darker_background = "#1a0d05";
            text = "#ffefe1";
            foreground = "#e5a474";
            darker_foreground = "#9e6643";
        }
        else if (name === "cyber") {
            background = "#101010";
            nav_background = "#080808";
            darker_background = "#000000";
            text = "#00ffcc";
            foreground = "#00bfa5";
            darker_foreground = "#00796b";
        }
        else if (name === "forest") {
            background = "#1a3321";
            nav_background = "#132618";
            darker_background = "#0b180f";
            text = "#e0f2e9";
            foreground = "#8cb891";
            darker_foreground = "#567a5c";
        }
        else if (name === "lavender") {
            background = "#22172b";
            nav_background = "#1a1221";
            darker_background = "#100a14";
            text = "#f3eaff";
            foreground = "#c5a3de";
            darker_foreground = "#8565a8";
        }
        else if (name === "midnight") {
            background = "#0d021f";
            nav_background = "#150734";
            darker_background = "#090219";
            text = "#e0d4ff";
            foreground = "#9a70d8";
            darker_foreground = "#65449b";
        }
        else if (name === "dunes") {
            background = "#f4e4c1";
            nav_background = "#e1c899";
            darker_background = "#b8926c";
            text = "#3a2f2f";
            foreground = "#8a5a44";
            darker_foreground = "#5c3c2e";
        }
        else if (name === "aurora") {
            background = "#1b3b5f";
            nav_background = "#122c48";
            darker_background = "#09172e";
            text = "#daf7ff";
            foreground = "#74d3e9";
            darker_foreground = "#4b9bb8";
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

// Explicitly Attach Functions to window.
// - To make addTimeToSession (or any other function) accessible from index.html, 
//   we need to attach it to the window object
window.openNav = openNav;
window.closeNav = closeNav;
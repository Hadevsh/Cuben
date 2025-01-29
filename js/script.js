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

openNav();

function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');

    // Create toast element
    const toast = document.createElement('div');
    toast.classList.add('toast', 'show');

    let toast_color = 'white'; // white is default
    let icon = ''; // no icon is default
    // Set type-specific colors
    switch (type) {
        case 'success':
            toast_color = 'green';
            icon = 'check';
            break;
        case 'error':
            toast_color = 'red';
            icon = 'error';
            break;
        case 'warning':
            toast_color = 'orange';
            icon = 'warning';
            break;
        case 'info':
            toast_color = 'blue';
            icon = 'info';
        default:
            toast_color = 'white';
            icon = '';
    }

    // Set text content
    // toast.textContent = message;
    toast.style.backgroundColor = toast_color
    toast.innerHTML = `<i class="fa fa-${icon}" id="unsaved-category" style="color: #fff; background: ${'green'}"></i> ${message}`
    toastContainer.appendChild(toast);

    // Remove after duration
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// Example usage:
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("test-btn").addEventListener("click", () => {
        showToast("This is a test notification!", "success");
    });
});
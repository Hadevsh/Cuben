export function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');

    if (!toastContainer) {
        console.error("Toast container not found in the document.");
        return;
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.classList.add('toast', 'show');

    let toast_color = 'white'; // white is default
    let icon = ''; // no icon is default
    // Set type-specific colors
    switch (type) {
        case 'success':
            toast_color = '#37a348';
            icon = 'check';
            break;
        case 'error':
            toast_color = '#d64949';
            icon = 'exclamation';
            break;
        case 'warning':
            toast_color = '#d6a949';
            icon = 'warning';
            break;
        case 'info':
            toast_color = '#4992d6';
            icon = 'info';
            break;
        default:
            toast_color = 'white';
            icon = '';
    }

    // Set text content
    // toast.textContent = message;
    toast.style.backgroundColor = toast_color
    toast.innerHTML = `<i class="fa fa-${icon}" id="unsaved-category" style="color: #fff; background: ${toast_color}"></i> ${message}`
    toastContainer.appendChild(toast);

    // Remove after duration
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}
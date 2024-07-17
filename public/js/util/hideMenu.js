document.addEventListener("DOMContentLoaded", function() {

    function hideRegisterMenuItem() {
        const registerMenuItem = document.getElementById('registerMenuItem');
        if (registerMenuItem && user.level !== 'admin') {
            registerMenuItem.style.display = 'none';
        }
    }
    hideRegisterMenuItem();
});
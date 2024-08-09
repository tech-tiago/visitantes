document.addEventListener('DOMContentLoaded', () => {
    const userInfo = document.querySelector('.top-right-menu .user-info');
    const dropdown = document.querySelector('.top-right-menu .sidebar-dropdown');

    // Abre o menu dropdown ao clicar no user-info
    userInfo.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('is-active');
    });

    // Fecha o menu dropdown ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !userInfo.contains(e.target)) {
            dropdown.classList.remove('is-active');
        }
    });

    // Fecha o menu dropdown ao clicar em um item do menu
    dropdown.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
        });
    });

    const burgerIcon = document.querySelector('.sidebar-burger');
    const sidebarMenu = document.querySelector('#sidebarMenu');
    const mainContent = document.querySelector('.main-content');

    burgerIcon.addEventListener('click', () => {
        sidebarMenu.classList.toggle('is-hidden');
        burgerIcon.classList.toggle('is-active');
        mainContent.classList.toggle('is-expanded');
    });

});

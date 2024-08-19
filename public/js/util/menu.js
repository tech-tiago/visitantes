document.addEventListener('DOMContentLoaded', () => {
    const userInfo = document.querySelector('.top-right-menu .user-info');
    const dropdown = document.querySelector('.top-right-menu .sidebar-dropdown');

    const burgerIcon = document.querySelector('.sidebar-burger');
    const sidebarMenu = document.querySelector('#sidebarMenu');
    const sidebarHeader = document.querySelector('.sidebar-header');
    const mainContent = document.querySelector('.main-content');

    burgerIcon.addEventListener('click', () => {
        sidebarMenu.classList.toggle('collapsed');
        sidebarHeader.classList.toggle('collapsed');
        mainContent.classList.toggle('is-expanded');

        // Recalcula o tamanho da tabela após a animação
        setTimeout(() => {
            table.columns.adjust().draw();
        }, 310); // Tempo ligeiramente superior ao da transição CSS
    });

    // Atualiza a versão do sidebar
    const versionElement = document.getElementById('sidebarVersion');
    const newVersion = '1.1.4';
    versionElement.textContent = `v${newVersion}`;
});


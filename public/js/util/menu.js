document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(menuItem => {
        menuItem.addEventListener('click', () => {
            menuItems.forEach(item => item.classList.remove('is-active'));
            menuItem.classList.add('is-active');
        });
    });

    document.getElementById('composeButton').addEventListener('click', composeMessage);
    document.getElementById('inboxMenuItem').addEventListener('click', loadInbox);
    document.getElementById('sentMenuItem').addEventListener('click', loadSent);
    document.getElementById('archivedMenuItem').addEventListener('click', loadArchived);
    document.getElementById('trashMenuItem').addEventListener('click', loadDeleted);
});

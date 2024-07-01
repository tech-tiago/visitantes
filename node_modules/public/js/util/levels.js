document.addEventListener('DOMContentLoaded', function() {
    var userLevel = localStorage.getItem('userLevel');

    if (userLevel === 'admin') {
        var registerLink = document.createElement('li');
        registerLink.innerHTML = '<a href="/register.html">Register</a>';
        document.querySelector('.top-bar ul').appendChild(registerLink);
    }
});

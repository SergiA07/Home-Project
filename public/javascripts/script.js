const toggleButton = document.getElementsByClassName('navbar_toggleButton')[0];
const navbarLinks = document.getElementsByClassName('navbar_links')[0];
const xButton = document.getElementsByClassName('navbar_xButton')[0];

toggleButton.addEventListener('click', () => navbarLinks.classList.toggle('active'))
xButton.addEventListener('click', () => navbarLinks.classList.toggle('active'))
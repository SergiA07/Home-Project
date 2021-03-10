const toggleButton = document.getElementsByClassName('navbar_toggleButton')[0];
const navbarLinks = document.getElementsByClassName('navbar_links')[0];
const xButton = document.getElementsByClassName('navbar_xButton')[0];

toggleButton.addEventListener('click', () => navbarLinks.classList.toggle('active'))
xButton.addEventListener('click', () => navbarLinks.classList.toggle('active'))


////////
const address = window.location.pathname.split('/')
if(address[address.length-1] == 'info') {
    console.log('dins')
    const infoButton = document.getElementsByClassName("info-Button")[0];
    const infoData = document.getElementsByClassName("content-infoData")[0];
    infoButton.addEventListener('click', () => infoData.classList.toggle('active'))
}

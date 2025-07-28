'use strict';

function updateCartBadge(){
    const count = window.CartUtils ? window.CartUtils.getCount() : 0;
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

// ? Navbar
function loadNavbar() {
    const userJson = localStorage.getItem('currentUser');
    let navbarFile = "/components/navbar.html";
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            if (user.rol === 'admin' || user.rol === 'editor') {
                navbarFile = "/components/navbar_admin.html";
            }
        } catch (e) {
            console.error('Error parsing currentUser', e);
        }
    }
    fetch(navbarFile).then(response => response.text()).then(data => {
        const destinyElement = document.querySelector("#navbar");
        if(destinyElement){
            destinyElement.innerHTML = data;
            setupNavbar(destinyElement);
        }
    }).catch(error => {
        console.log("Error al cargar el navbar: ", error);
    });
}

// ? Footer

function loadFooter() {
    fetch("/components/footer.html").then(response => response.text()).then(data =>{
        const destinyElement = document.querySelector("#footer");
        if(destinyElement){
            destinyElement.innerHTML = data;
            setupFooter(destinyElement);
        }
    }).catch(error => {
        console.log("Error al cargar el footer: ", error);
    })
}

function setupFooter(footer){
    const userJson = localStorage.getItem('currentUser');
    const loginLink = footer.querySelector('#footer-login-link');
    if(!loginLink) return;
    if(userJson){
        loginLink.textContent = '• Cerrar sesión';
        loginLink.href = '#';
        loginLink.classList.remove('login-link');
        loginLink.classList.add('logout-link');
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = '/index.html';
        });
    }else{
        loginLink.textContent = '• Iniciar sesión';
        loginLink.href = '/html/inicioSesion.html';
        loginLink.classList.remove('logout-link');
        loginLink.classList.add('login-link');
    }
}

// ? Navbar admin

function loadNavbarAdmin() {
    fetch("/components/navbar_admin.html").then(response => response.text()).then(data => {
        const destinyElement = document.querySelector("#navbarAdmin");
        if(destinyElement){
            destinyElement.innerHTML = data;
            setupNavbar(destinyElement);
        }
    }).catch(error => {
        console.log("Error al cargar el navbar: ", error);
    });
}

function setupNavbar(nav){
    const userJson = localStorage.getItem('currentUser');
    const loginItem = nav.querySelector('#nav-login-item');
    const userMenu = nav.querySelector('#nav-user-menu');
    const adminLink = nav.querySelector('#nav-admin-link');
    const loginItemM = nav.querySelector('#nav-login-item-m');
    const userMenuM = nav.querySelector('#nav-user-menu-m');
    const adminLinkM = nav.querySelector('#nav-admin-link-m');
    const logoutBtn = nav.querySelector('#navLogout');
    const logoutBtnM = nav.querySelector('#navLogoutM');
    const nameSpan = nav.querySelector('#nav-user-name');
    const nameSpanM = nav.querySelector('#nav-user-name-m');
    updateCartBadge();

    if(!userJson){
        loginItem?.classList.remove('d-none');
        userMenu?.classList.add('d-none');
        loginItemM?.classList.remove('d-none');
        userMenuM?.classList.add('d-none');
        return;
    }
    const user = JSON.parse(userJson);
    nameSpan && (nameSpan.textContent = user.nombre || 'Usuario');
    nameSpanM && (nameSpanM.textContent = user.nombre || 'Usuario');
    loginItem?.classList.add('d-none');
    userMenu?.classList.remove('d-none');
    loginItemM?.classList.add('d-none');
    userMenuM?.classList.remove('d-none');
    if(user.rol === 'admin' || user.rol === 'editor'){
        adminLink?.classList.remove('d-none');
        adminLinkM?.classList.remove('d-none');
    }else{
        adminLink?.classList.add('d-none');
        adminLinkM?.classList.add('d-none');
    }
    const doLogout = () => {
        localStorage.removeItem('currentUser');
        window.location.href = '/index.html';
    };
    logoutBtn?.addEventListener('click', doLogout);
    logoutBtnM?.addEventListener('click', doLogout);
}

// * Mandar a llamar las funciones
document.addEventListener("DOMContentLoaded", loadNavbar);
document.addEventListener("DOMContentLoaded", loadFooter);
document.addEventListener("DOMContentLoaded", loadNavbarAdmin);
document.addEventListener("DOMContentLoaded", updateCartBadge);

// ? Colocar la clase active
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link[href]");
  const currentPath = window.location.pathname.replace(/\/$/, '');

  // Marcar el enlace correspondiente a la ruta actual
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '');

    if (linkPath === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }

    // Además, escuchar clics para cambio visual inmediato
    link.addEventListener("click", () => {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
});

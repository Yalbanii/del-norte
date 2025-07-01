// ? Navbar
function loadNavbar() {
    fetch("/components/navbar.html").then(response => response.text()).then(data => {
        const destinyElement = document.querySelector("#navbar");
        if(destinyElement){
            destinyElement.innerHTML = data;
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
        }
    }).catch(error => {
        console.log("Error al cargar el footer: ", error);
    })
}

// * Mandar a llamar las funciones
document.addEventListener("DOMContentLoaded", loadNavbar);
document.addEventListener("DOMContentLoaded", loadFooter);


// ? Colocar la clase active
/*
  document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const currentPath = window.location.pathname;

    // Marcar el enlace correspondiente a la ruta actual
    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;

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
*/
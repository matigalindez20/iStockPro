document.addEventListener('DOMContentLoaded', function() {

    // 1. Animaciones de Scroll (Fade-in/Slide-in)
    const scrollElements = document.querySelectorAll('.audience-item, .service-card, .benefit-item, .team-member, .price-card');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const elementOutOfView = (el) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop > (window.innerHeight || document.documentElement.clientHeight)
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const hideScrollElement = (element) => {
        // Opcional: si quieres que se oculten al salir de la vista hacia arriba
        // element.classList.remove('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) { // 1.25 para que se active un poco antes de estar completamente en vista
                displayScrollElement(el);
            } else if (elementOutOfView(el)) {
                // hideScrollElement(el); // Descomentar si quieres que se oculten
            }
        });
    };

    // Inicializa los elementos que ya están en vista al cargar
    handleScrollAnimation();
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });


    // 2. Smooth Scrolling para enlaces del menú
    const navLinks = document.querySelectorAll('header nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            let targetId = this.getAttribute('href');
            // Si el targetId es solo "#", apunta al inicio de la página
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            let targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Ajuste para el header fijo
                const headerOffset = document.querySelector('header').offsetHeight + 20; // 20px de margen extra
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // 3. Resaltado del enlace activo en el menú al hacer scroll
    const sections = document.querySelectorAll('section[id]'); // Todas las secciones con ID
    const menuLinks = document.querySelectorAll('header nav a');

    const activateMenuLink = () => {
        let currentSection = '';
        const headerHeight = document.querySelector('header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // 50px de margen
            if (pageYOffset >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateMenuLink);
    activateMenuLink(); // Llamar una vez al cargar para la sección inicial

});


// ========= SCRIPT FORMULARIO DE CONTACTO (CON AJAX PARA FORMSPREE) =========
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('proyectoForm');
    const statusMessage = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenir el envío tradicional

            const formData = new FormData(form);
            statusMessage.textContent = 'Enviando...';
            statusMessage.className = 'form-status-message'; // Reset class

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    statusMessage.textContent = '¡Gracias! Tu consulta ha sido enviada con éxito.';
                    statusMessage.classList.add('success');
                    form.reset(); // Limpiar el formulario
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            statusMessage.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            statusMessage.textContent = 'Oops! Hubo un problema al enviar tu consulta. Intenta de nuevo.';
                        }
                        statusMessage.classList.add('error');
                    })
                }
            }).catch(error => {
                statusMessage.textContent = 'Oops! Hubo un problema de red al enviar tu consulta. Intenta de nuevo.';
                statusMessage.classList.add('error');
            });
        });
    }
});



/* Probando */

document.addEventListener('DOMContentLoaded', () => {
  const elementoPalabra = document.getElementById('palabraCambiante');
  const palabras = ["Tienda", "Futuro"]; // Palabras que rotarán
  // Si quieres más palabras, solo añádelas aquí: const palabras = ["Tienda", "Futuro", "Solución", "Plataforma"];
  let indiceActual = 0; // Empezará con "Tienda" (índice 0 del array) si el HTML tiene "Tienda"

  const duracionVisible = 2500;    // Tiempo que cada palabra es visible (en ms)
  const duracionTransicion = 300; // Debe coincidir con la transición en CSS (en ms)

  if (!elementoPalabra) {
    console.error("¡ERROR! No se encontró el elemento con ID 'palabraCambiante'. Revisa tu HTML.");
    return;
  }
  console.log("Elemento 'palabraCambiante' encontrado:", elementoPalabra);
  console.log("Palabras para rotar:", palabras);
  console.log("Palabra inicial en HTML:", elementoPalabra.textContent);

  // Asegurarnos que el indiceActual coincide con la palabra inicial en el HTML, si está en la lista
  const palabraHtmlInicial = elementoPalabra.textContent.trim();
  const indiceHtmlEnArray = palabras.indexOf(palabraHtmlInicial);
  if (indiceHtmlEnArray !== -1) {
    indiceActual = indiceHtmlEnArray;
    console.log("Palabra del HTML encontrada en el array. Iniciando con índice:", indiceActual);
  } else {
    // Si la palabra del HTML no está en el array, la primera palabra del array se mostrará primero
    // pero esto sucederá DESPUÉS de la primera transición. Para mostrarla de inmediato:
    // elementoPalabra.textContent = palabras[0];
    // console.warn("Palabra del HTML no está en el array. Se usará la primera del array después de la primera transición.");
    // O puedes forzar que la palabra inicial del HTML sea la primera en mostrarse, y luego cambiarla.
    // Por simplicidad, ahora asumimos que la palabra del HTML es la primera que queremos mostrar.
  }


  function cambiarPalabra() {
    console.log("--- Función cambiarPalabra iniciada ---");
    console.log("Índice actual (antes del cambio):", indiceActual);

    elementoPalabra.classList.add('ocultandose');
    console.log("Clase 'ocultandose' añadida.");

    setTimeout(() => {
      console.log("--- Dentro del setTimeout ---");
      indiceActual = (indiceActual + 1) % palabras.length;
      
      console.log("Nuevo índice:", indiceActual, "| Nueva palabra a mostrar:", palabras[indiceActual]);
      
      elementoPalabra.textContent = palabras[indiceActual];
      console.log("textContent actualizado a:", elementoPalabra.textContent);
      
      elementoPalabra.classList.remove('ocultandose');
      console.log("Clase 'ocultandose' removida.");
      console.log("------------------------------------");
    }, duracionTransicion);
  }

  // Iniciar el ciclo
  console.log(`Configurando setInterval. Cada palabra cambiará después de ${duracionVisible + duracionTransicion} ms.`);
  setInterval(cambiarPalabra, duracionVisible + duracionTransicion);
});

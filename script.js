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
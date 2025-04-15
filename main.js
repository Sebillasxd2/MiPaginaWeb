document.addEventListener('DOMContentLoaded', function() {
  
    const inicioContent = document.getElementById('inicio').innerHTML;
    
    // Función para cargar contenido externo
    async function loadContent(url, containerId) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('text/html')) {
                throw new Error('Tipo de contenido no válido');
            }

            const html = await response.text();
            const container = document.getElementById(containerId);
            if (!container) throw new Error('Contenedor no encontrado');
            container.innerHTML = html;
            
         
            if (containerId === 'certificados') {
                initImageModal();
            } else if (containerId === 'about') {
                initTimelineAnimation();
            }
        } catch (error) {
            console.error('Error al cargar contenido:', error);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <p>⚠️ Error al cargar el contenido: ${error.message}</p>
                    </div>
                `;
            }
        }
    }

    // Función para animar timeline
    function initTimelineAnimation() {
        setTimeout(() => {
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 200);
            });
        }, 100);
    }

    // Función para el visor de imágenes
    function initImageModal() {
        const modal = document.getElementById('image-modal');
        if (!modal) return;

        const modalImg = document.getElementById('modal-image');
        const captionText = document.getElementById('caption');
        const closeModal = document.querySelector('.close-modal');
        
        document.querySelectorAll('.certificado-img').forEach(img => {
            img.addEventListener('click', function() {
                modal.style.display = "block";
                modalImg.src = this.dataset.fullsize || this.src;
                captionText.innerHTML = this.alt;
            });
        });

        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.style.display = "none";
            });
        }

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === "Escape" && modal.style.display === "block") {
                modal.style.display = "none";
            }
        });
    }

    // Manejador de navegación
    function setupNavigation() {
        const links = document.querySelectorAll('.sidebar a');
        if (!links.length) return;

        links.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                
                links.forEach(el => el.classList.remove('active'));
                link.classList.add('active');
                
                const sectionId = link.getAttribute('data-section');
                const contentContainer = document.querySelector('.content');
                
                if (!contentContainer) return;
                
                // Limpiar contenedor
                contentContainer.innerHTML = `<div id="${sectionId}" class="content-section active"></div>`;
                
                
                switch (sectionId) {
                    case 'inicio':
                        document.getElementById(sectionId).innerHTML = inicioContent;
                        break;
                    case 'certificados':
                        await loadContent('certificados.html', sectionId);
                        break;
                    case 'proyectos':
                        await loadContent('proyectos.html', sectionId);
                        break;
                    case 'about':
                        await loadContent('sobremi.html', sectionId);
                        break;
                    default:
                        document.getElementById(sectionId).classList.add('active');
                }
            });
        });
    }

    // Inicialización
    setupNavigation();
});
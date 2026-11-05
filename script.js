let slideshowData = [];
let currentIndex = 0;
let slideInterval;

const imgElement = document.getElementById("slide-img");
const slideBgContainer = document.querySelector(".slide-background");
const titleElement = document.getElementById("slide-title");
const textElement = document.getElementById("slide-text");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

// 1. Configuración del Reproductor Oculto de YouTube
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: 'mpcdVY9zXd4', // ID de tu canción de YouTube
        playerVars: {
            'autoplay': 1,
            'loop': 1,
            'playlist': 'mpcdVY9zXd4' // Necesario para que el loop funcione en YouTube
        },
        events: {
            'onReady': (event) => {
                event.target.playVideo();
            }
        }
    });
}

// 2. Cargar el JSON de datos y slideshow
async function loadSlideshow() {
    try {
        const response = await fetch("data.json");
        slideshowData = await response.json();
        
        if (slideshowData.length > 0) {
            updateSlide();
            startAutoPlay();
        }
    } catch (error) {
        console.error("Error al cargar el JSON:", error);
    }
}

function updateSlide() {
    const current = slideshowData[currentIndex];
    
    imgElement.style.opacity = 0;
    
    setTimeout(() => {
        imgElement.src = current.imagen;
        slideBgContainer.style.setProperty('--bg-blur', `url('${current.imagen}')`);
        
        titleElement.textContent = current.titulo;
        textElement.textContent = current.texto;
        imgElement.style.opacity = 1;
    }, 150);
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slideshowData.length;
    updateSlide();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slideshowData.length) % slideshowData.length;
    updateSlide();
}

function startAutoPlay() {
    // 1000 ms = 1 segundo por imagen
    slideInterval = setInterval(nextSlide, 3000);
}

function resetTimer() {
    clearInterval(slideInterval);
    startAutoPlay();
}

nextBtn.addEventListener("click", () => {
    nextSlide();
    resetTimer();
});

prevBtn.addEventListener("click", () => {
    prevSlide();
    resetTimer();
});

// Forzar la reproducción si el navegador bloquea el autoplay inicial por políticas de seguridad
document.addEventListener('click', () => {
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
}, { once: true });

loadSlideshow();
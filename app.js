const duracionPartida = 30; // duración de la partida (en segundos)
const numeroNaves = 5; // número de zombis que pueden aparecen en pantalla.
let partidaIniciada = false; //indicador de partida iniciada (en ese caso su valor sería true).
let temporizador; // el identificador del temporizador que contabiliza el tiempo (y el movimiento del juego
let puntuacion; //puntuación
let tiempo; //tiempo actual
const listaNaves = []; //Objeto que guarda la lista de los zombies
let explosion; //Objeto que guarda la explosion
const html = document.querySelector("HTML");
const boton = document.querySelector("button");
const audioExplosion = document.getElementById("audioExplosion");
const fondoMusical = document.getElementById("fondoMusical");
const marcadorPuntuacion = document.getElementById("puntuacion");
const marcadorTiempo = document.getElementById("tiempo");
crearNave(); //Se llama a las funciones
crearExplosion();

boton.addEventListener("click", iniciarPartida);
window.addEventListener("blur", function () {
    partidaIniciada = false;
    fondoMusical.pause();
});
window.addEventListener("focus", function () {
    partidaIniciada = true;
    fondoMusical.play();
});

function iniciarPartida() {
    if (html.requestFullscreen) { html.requestFullscreen(); }
    else if (html.mozRequestFullScreen) { html.mozRequestFullScreen(); }
    else if (html.webkitRequestFullscreen) { html.webkitRequestFullscreen(); }
    window.screen.orientation.lock('portrait');
    partidaIniciada = true;
    boton.style.display = "none";
    puntuacion = 0;
    tiempo = 0;
    marcadorPuntuacion.innerHTML = "PUNTUACIÓN: " + puntuacion;
    marcadorTiempo.innerHTML = "TIEMPO: " + tiempo;
    marcadorPuntuacion.style.display = "block";
    marcadorTiempo.style.display = "block";
    temporizador = window.setInterval(actualizarPantalla, 800);
    fondoMusical.play();
}

function crearNave() {
    for (let x = 0; x < numeroNaves; x++) {
        const nave = document.createElement("img");
        html.appendChild(nave);
        nave.src = "./assets/images/nave.png";
        nave.style.position = "absolute";
        nave.style.zIndex = "1";
        nave.style.display = "none";
        nave.addEventListener("touchstart", explotarNave);
        listaNaves[x] = nave;
    }
}


function crearExplosion() {
    explosion = document.createElement("img");
    html.appendChild(explosion);
    explosion.src = "./assets/images/explosion.png";
    explosion.style.position = "absolute";
    explosion.style.zIndex = "-1";
    explosion.style.display = "none";
}


function actualizarPantalla() {
    if (partidaIniciada) {
        explosion.style.display = "none";
        actualizarTiempo();
        actualizarNave();
    }
}
function actualizarTiempo() {
    tiempo += 0.5;
    if (tiempo >= duracionPartida) {
        partidaIniciada = false;
        clearTimeout(temporizador);
        fondoMusical.pause();
        boton.style.display = "block";
    }
    else marcadorTiempo.innerHTML = "TIEMPO: " + Math.round(tiempo);
}


function actualizarNave() {
    let naveX, naveY;
    for (let x = 0; x < numeroNaves; x++) {
        const nave = listaNaves[x];
        if (Math.random() > 0.5) {
            naveX = Math.random() * (window.innerWidth - nave.clientWidth);
            naveY = Math.random() * (window.innerHeight - nave.clientHeight);
            nave.style.left = naveX + "px";
            nave.style.top = naveY + "px";
            nave.style.display = "block";
        }
    }
}

function explotarNave(evento) {
    if (partidaIniciada) {
        audioExplosion.currentTime = 0; // Asegúrate de que el audio de la explosión se reinicie
        audioExplosion.play(); // Reproduce el audio de la explosión
        const nave = evento.target;
        const puntoContacto = evento.changedTouches[0]; // Asegúrate de obtener el punto de contacto correctamente
        puntuacion += 1;
        marcadorPuntuacion.innerHTML = "PUNTUACIÓN: " + puntuacion;
        nave.style.display = "none";
        explosion.style.display = "block";
        explosion.style.left = puntoContacto.clientX - explosion.clientWidth / 2 + "px";
        explosion.style.top = puntoContacto.clientY - explosion.clientHeight / 2 + "px";
    }
}
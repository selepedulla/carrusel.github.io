

const productos = [
    {
        nombre:      "jean clasico chupin",
        precio:      25000,
        descripcion: "Algodón 100%, disponible en varios colores.",
        imagen:      "./img/CHUPIN.png"
    },
    {
        nombre:      "calzonsillos kalvin clein",
        precio:      100000000,
        descripcion: "algodon y poliester.",
        imagen:       "./img/CALVIN.png"
    },
    {
        nombre:      "iphone 18 pro max",
        precio:      5000000,
        descripcion: "ultima tecnologia.",
        imagen:      "./img/IPHONE.png"
    },
    {
        nombre:      "Auriculares Bluetooth jbl",
        precio:      450000,
        descripcion: "Inalámbricos, 7 dias de duracion de bateria",
        imagen:      "./img/auris.png"
    },
    {
        nombre:      "campera adidas",
        precio:      35000,
        descripcion: "algodin puro.",
        imagen:       "./img/ADIDAS.png"
    },
    {
        nombre:      "Mouse Gamer",
        precio:      60000,
        descripcion: "12000 DPI, diseño ergonómico, 7 botones.",
        imagen:      "./img/mouse.png"
    },
    {
        nombre:      "Monitor 90\"",
        precio:      150000,
        descripcion: "Full HD, 144Hz, panel IPS, sin bordes.",
        imagen:       "./img/monitor.png"
    },
    {
        nombre:      "Pad de Escritorio",
        precio:      80000,
        descripcion: "Extra large, 80×40 cm, base antideslizante.",
        imagen:       "./img/pad.png"
    }
];


// ============================================================
// ════════════════════════════════════════════════════════════
//  PARTE 2 — CARRUSEL
// ════════════════════════════════════════════════════════════
// ============================================================

// ── VARIABLES DE ESTADO DEL CARRUSEL ─────────────────────
//
// Estas variables recuerdan la posición actual del carrusel.
// "cuantasVeVisible" = cuántas tarjetas se ven a la vez (4).
// "posicion" = cuántos pasos nos desplazamos (empieza en 0).
//
const cuantasVeVisible = 4;
let posicion = 0;

// ── FUNCIÓN: renderizarProductos() ───────────────────────
//
// Crea dinámicamente las tarjetas HTML para cada producto
// y las inserta dentro de #carrusel-track.
//
// innerHTML construye el HTML de la tarjeta como un string.
// Usamos template literals (acento grave `) para interpolar
// los valores del objeto: ${producto.nombre}, etc.
//
function renderizarProductos() {

    let track = document.getElementById('carrusel-track');
    track.innerHTML = '';  // limpiamos antes de llenar

    // ── forEach recorre TODOS los elementos del array ──────
    // Para cada producto creamos una tarjeta y la agregamos.
    //
    productos.forEach(function(producto, i) {

        // Formateamos el precio: 18900 → "18.900"
        let precioFormateado = producto.precio.toLocaleString('es-AR');

        // Creamos el elemento <div> de la tarjeta
        let tarjeta = document.createElement('div');
        tarjeta.classList.add('producto-card');

        // Le inyectamos el HTML interno
        // Nota: pasamos el índice "i" al botón para saber
        // qué producto agregar cuando se haga clic.
        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="producto-info">
                <p class="producto-nombre">${producto.nombre}</p>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <p class="producto-precio">$${precioFormateado}</p>
                <button class="btn-agregar" onclick="agregarAlCarrito(${i})">
                    🛒 Agregar al carrito
                </button>
            </div>
        `;

        track.appendChild(tarjeta);
    });

    // Una vez creadas las tarjetas, generamos los puntitos indicadores
    renderizarIndicadores();

    // Y actualizamos el estado de las flechas
    actualizarFlechas();
}


// ── FUNCIÓN: renderizarIndicadores() ─────────────────────
//
// Crea los puntitos (uno por "página" del carrusel).
// Una página = cuantasVeVisible tarjetas.
//
function renderizarIndicadores() {

    let contenedor = document.getElementById('indicadores');
    contenedor.innerHTML = '';

    // ¿Cuántas páginas hay?
    // Si hay 8 productos y se ven 4 a la vez → 2 páginas
    // Math.ceil redondea hacia arriba: ceil(5/4) = 2 páginas
    let totalPaginas = Math.ceil(productos.length / cuantasVeVisible);

    for (let i = 0; i < totalPaginas; i++) {

        let punto = document.createElement('button');
        punto.classList.add('punto');

        // El puntito de la página actual se marca como "activo"
        if (i === Math.floor(posicion / cuantasVeVisible)) {
            punto.classList.add('activo');
        }

        // Al hacer clic en un puntito, saltamos a esa página
        punto.onclick = function() {
            posicion = i * cuantasVeVisible;
            aplicarDesplazamiento();
        };

        contenedor.appendChild(punto);
    }
}


// ── FUNCIÓN: moverCarrusel(direccion) ────────────────────
//
// Se llama cuando el usuario presiona ◀️ o ▶️.
// direccion = -1 (izquierda) o +1 (derecha)
//
// CÓMO FUNCIONA EL DESPLAZAMIENTO:
//   La "cinta" (.carrusel-track) tiene TODAS las tarjetas en fila.
//   Para ver las siguientes, la movemos hacia la izquierda con:
//       transform: translateX(-Xpx)
//   Cuanto más negativo el valor, más nos desplazamos a la derecha.
//
function moverCarrusel(direccion) {

    // Sumamos cuantasVeVisible posiciones (avanzamos de a 4)
    posicion = posicion + (direccion * cuantasVeVisible);

    // ── LÍMITES ────────────────────────────────────────────
    // No podemos ir antes del inicio (posición 0)
    if (posicion < 0) {
        posicion = 0;
    }

    // No podemos ir más allá del último producto visible
    // Máximo: la última "página" posible
    let maxPosicion = productos.length - cuantasVeVisible;
    if (posicion > maxPosicion) {
        posicion = maxPosicion;
    }

    aplicarDesplazamiento();
}


// ── FUNCIÓN: aplicarDesplazamiento() ─────────────────────
//
// Mueve la cinta al lugar correcto según "posicion".
// También actualiza las flechas y los puntitos.
//
function aplicarDesplazamiento() {

    let track = document.getElementById('carrusel-track');

    // ── CALCULAMOS EL DESPLAZAMIENTO ───────────────────────
    //
    // Queremos mover la cinta tantos "anchos de tarjeta" como
    // indique la variable "posicion".
    //
    // Cada tarjeta ocupa: calc(25% - 0.9rem) + gap de 1.2rem
    // En lugar de calcular eso en píxeles (que depende del tamaño
    // de pantalla), usamos un truco con porcentajes del track:
    //
    // El ancho del track visible es 100%.
    // Si cada tarjeta ocupa 25%, para desplazar N tarjetas:
    //   translateX = -(N * (100% / cuantasVeVisible))
    //
    // Pero con el gap necesitamos ajustar. La fórmula exacta:
    //   cada tarjeta = calc(25% - 0.9rem)
    //   gap          = 1.2rem
    //   desplazamiento por tarjeta = calc(25% - 0.9rem + 1.2rem) = calc(25% + 0.3rem)
    //
    let desplazamiento = posicion * (100 / cuantasVeVisible);
    track.style.transform = `translateX(calc(-${desplazamiento}% - ${posicion * 0.3}rem))`;

    actualizarFlechas();
    actualizarPuntos();
}


// ── FUNCIÓN: actualizarFlechas() ─────────────────────────
//
// Deshabilita la flecha izquierda si estamos al inicio,
// y la derecha si estamos al final.
//
function actualizarFlechas() {

    let btnAnterior = document.getElementById('btn-anterior');
    let btnSiguiente = document.getElementById('btn-siguiente');

    // Si posicion === 0, estamos en el primer grupo → deshabilitar ◀️
    btnAnterior.disabled = (posicion === 0);

    // Si posicion >= total - visibles, estamos al final → deshabilitar ▶️
    btnSiguiente.disabled = (posicion >= productos.length - cuantasVeVisible);
}


// ── FUNCIÓN: actualizarPuntos() ──────────────────────────
//
// Marca el puntito de la página actual como "activo".
//
function actualizarPuntos() {

    let puntos = document.querySelectorAll('.punto');
    let paginaActual = Math.floor(posicion / cuantasVeVisible);

    puntos.forEach(function(punto, i) {
        if (i === paginaActual) {
            punto.classList.add('activo');
        } else {
            punto.classList.remove('activo');
        }
    });
}


// ============================================================
// ════════════════════════════════════════════════════════════
//  PARTE 3 — CARRITO DE COMPRAS
// ════════════════════════════════════════════════════════════
// ============================================================

// ── ARRAY DEL CARRITO ─────────────────────────────────────
//
// Guardamos aquí los productos que el usuario agrega.
// Cada elemento del carrito es el índice del producto en el array "productos".
// También podríamos guardar objetos completos; usamos índices por simplicidad.
//
let carrito = [];


// ── FUNCIÓN: agregarAlCarrito(indiceProducto) ─────────────
//
// Se llama al hacer clic en "🛒 Agregar al carrito" de cada tarjeta.
// Recibe el ÍNDICE del producto dentro del array "productos".
//
function agregarAlCarrito(indiceProducto) {

    // Obtenemos el producto completo desde el array
    let producto = productos[indiceProducto];

    // Lo agregamos al carrito (guardamos nombre y precio)
    carrito.push({
        nombre: producto.nombre,
        precio: producto.precio
    });

    // Actualizamos el contador del botón flotante
    let span = document.getElementById('contador-carrito');
    span.textContent = carrito.length;

    // Mostramos el botón flotante si todavía estaba oculto
    let botonFlotante = document.getElementById('carrito-flotante');
    botonFlotante.style.display = 'block';

    // ── ANIMACIÓN DE REBOTE ─────────────────────────────────
    // Removemos la clase "rebote" primero (si ya está)
    // para que se pueda volver a animar aunque se agregue
    // el mismo producto dos veces seguidas.
    //
    botonFlotante.classList.remove('rebote');

    // Forzamos al navegador a "releer" el elemento antes de
    // volver a agregar la clase (esto reinicia la animación).
    void botonFlotante.offsetWidth;

    botonFlotante.classList.add('rebote');

    // Quitamos la clase cuando termina la animación (0.4s)
    setTimeout(function() {
        botonFlotante.classList.remove('rebote');
    }, 400);
}


// ── FUNCIÓN: verCarrito() ─────────────────────────────────
//
// Muestra un resumen de los productos en el carrito.
// Se llama al hacer clic en el botón flotante 🛒.
//
function verCarrito() {

    if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }

    // Construimos el texto del resumen
    let total = 0;
    let resumen = '🛒 TU CARRITO:\n';
    resumen += '─────────────────────\n';

    carrito.forEach(function(item, i) {
        resumen += `${i + 1}. ${item.nombre} — $${item.precio.toLocaleString('es-AR')}\n`;
        total = total + item.precio;
    });

    resumen += '─────────────────────\n';
    resumen += `TOTAL: $${total.toLocaleString('es-AR')}`;

    alert(resumen);
}


// ============================================================
// ════════════════════════════════════════════════════════════
//  PARTE 4 — CAMBIO DE TEMA
// ════════════════════════════════════════════════════════════
// ============================================================

// ── FUNCIÓN: cambiarTema() ────────────────────────────────
//
// classList.toggle("oscuro") hace lo siguiente:
//   → Si <body> NO tiene la clase "oscuro" → la AGREGA
//   → Si <body> YA tiene la clase "oscuro"  → la QUITA
//
// En el CSS definimos body.oscuro { --fondo: ...; ... }
// Cuando esa clase está activa, los nuevos colores se aplican solos.
//
function cambiarTema() {

    document.body.classList.toggle('oscuro');

    // classList.contains() devuelve true si la clase está activa
    let boton = document.getElementById('btn-tema');

    if (document.body.classList.contains('oscuro')) {
        boton.textContent = '☀️ Modo Claro';
    } else {
        boton.textContent = '🌙 Modo Oscuro';
    }
}


// ============================================================
// INICIO — Se ejecuta cuando el HTML termina de cargarse
// ============================================================
//
// DOMContentLoaded se dispara cuando el navegador terminó de leer
// todo el HTML. Recién ahí llamamos a renderizarProductos()
// para asegurarnos de que #carrusel-track ya existe en la página.
//
document.addEventListener('DOMContentLoaded', function() {
    renderizarProductos();
});
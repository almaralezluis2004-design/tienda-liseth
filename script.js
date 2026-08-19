// =====================================================
// TIENDA LISETH JHOANA
// SUPABASE + PRODUCTOS + FILTROS + OFERTAS
// CARRITO + WHATSAPP
// =====================================================


// =====================================================
// CONFIGURACIÓN
// =====================================================

const NUMERO_WHATSAPP = "573127691029";


// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL =
    "https://dlggzzeqqnbgxfxmtjba.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_5UXDHLVNWDmll7jzACWZCA_Z7dv6yJt";


// =====================================================
// PRODUCTOS
// =====================================================

let productos = [];


// =====================================================
// CARRITO
// =====================================================

let carrito = [];


// =====================================================
// FORMATO DE PRECIOS
// =====================================================

function formatoPrecio(precio) {

    return "$" + Number(precio).toLocaleString("es-CO");

}


// =====================================================
// NORMALIZAR GÉNERO
// =====================================================

function normalizarGenero(genero) {

    if (!genero) {
        return "";
    }

    const valor =
        String(genero)
            .trim()
            .toLowerCase();

    if (
        valor === "mujer" ||
        valor === "mujeres"
    ) {

        return "mujer";

    }

    if (
        valor === "hombre" ||
        valor === "hombres"
    ) {

        return "hombre";

    }

    if (
        valor === "niño" ||
        valor === "niños" ||
        valor === "niña" ||
        valor === "niñas" ||
        valor === "niños y bebés" ||
        valor === "niños y bebes" ||
        valor === "niños,bebés" ||
        valor === "niños,bebes"
    ) {

        return "niños";

    }

    return valor;

}


// =====================================================
// NORMALIZAR CATEGORÍA
// =====================================================

function normalizarCategoria(categoria) {

    if (!categoria) {
        return "";
    }

    const valor =
        String(categoria)
            .trim()
            .toLowerCase();

    if (
        valor === "perfume" ||
        valor === "perfumes" ||
        valor === "colonia" ||
        valor === "colonias"
    ) {

        return "perfumes";

    }

    if (valor === "maquillaje") {

        return "maquillaje";

    }

    if (
        valor === "crema" ||
        valor === "cremas"
    ) {

        return "cremas";

    }

    if (
        valor === "shampoo" ||
        valor === "champú" ||
        valor === "champu"
    ) {

        return "shampoo";

    }

    if (
        valor === "cuidado" ||
        valor === "cuidado personal"
    ) {

        return "cuidado";

    }

    return valor;

}


// =====================================================
// CARGAR PRODUCTOS DESDE SUPABASE
// =====================================================

async function cargarProductosSupabase() {

    try {

        const respuesta = await fetch(
            `${SUPABASE_URL}/rest/v1/productos?select=*`,
            {
                method: "GET",

                headers: {
                    "apikey": SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${SUPABASE_KEY}`
                }
            }
        );


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );

        }


        const datos =
            await respuesta.json();


        console.log(
            "Productos cargados desde Supabase:"
        );

        console.log(datos);


        // =================================================
        // CONVERTIR SUPABASE
        // =================================================

        productos =
            datos.map(function(producto) {

                return {

                    id:
                        producto.id,

                    marca:
                        producto.marca || "",

                    nombre:
                        producto.nombre || "Producto",

                    precio:
                        Number(producto.precio) || 0,

                    imagen:
                        producto.imagenes || "",

                    categoria:
                        producto.categoria || "",

                    genero:
                        producto.genero || "",

                    oferta:
                        producto.en_oferta === true,

                    precioOferta:
                        producto.precio_oferta !== null &&
                        producto.precio_oferta !== undefined
                            ?
                            Number(producto.precio_oferta)
                            :
                            0,

                    descripcion:
                        producto.descripcion || ""

                };

            });


        console.log(
            "Productos convertidos:",
            productos
        );


        // =================================================
        // MOSTRAR PRODUCTOS
        // =================================================

        mostrarTodos();

        mostrarOfertas();

        actualizarCarrito();


    } catch (error) {

        console.error(
            "Error conectando con Supabase:",
            error
        );


        const contenedor =
            document.getElementById(
                "lista-productos"
            );


        if (contenedor) {

            contenedor.innerHTML = `

                <div class="sin-productos">

                    <h3>
                        ⚠️ No se pudieron cargar los productos
                    </h3>

                    <p>
                        Verifica la conexión con Supabase.
                    </p>

                </div>

            `;

        }

    }

}


// =====================================================
// CALCULAR PRECIO DE OFERTA
// =====================================================

function calcularPrecioOferta(producto) {

    if (
        producto.oferta === true &&
        producto.precioOferta !== undefined &&
        producto.precioOferta !== null &&
        producto.precioOferta > 0
    ) {

        return producto.precioOferta;

    }

    return producto.precio;

}


// =====================================================
// CALCULAR DESCUENTO VISUAL
// =====================================================

function calcularDescuentoVisual(producto) {

    if (
        producto.oferta !== true ||
        !producto.precio ||
        !producto.precioOferta
    ) {

        return 0;

    }


    return Math.round(
        (
            (
                producto.precio -
                producto.precioOferta
            )
            /
            producto.precio
        )
        *
        100
    );

}


// =====================================================
// NOMBRE BONITO DE LA MARCA
// =====================================================

function nombreMarca(marca) {

    if (!marca) {
        return "";
    }


    const marcaMinuscula =
        String(marca)
            .trim()
            .toLowerCase();


    if (marcaMinuscula === "esika") {

        return "Ésika";

    }


    if (marcaMinuscula === "yanbal") {

        return "Yanbal";

    }


    if (marcaMinuscula === "natura") {

        return "Natura";

    }


    if (
        marcaMinuscula === "l,bel" ||
        marcaMinuscula === "l.bel"
    ) {

        return "L'Bel";

    }


    if (marcaMinuscula === "cyzone") {

        return "Cyzone";

    }


    return marca;

}


// =====================================================
// NOMBRE BONITO DEL GÉNERO
// =====================================================

function nombreGenero(genero) {

    if (!genero) {
        return "";
    }


    const valor =
        normalizarGenero(genero);


    if (valor === "mujer") {

        return "Mujer";

    }


    if (valor === "hombre") {

        return "Hombre";

    }


    if (valor === "niños") {

        return "Niños y Bebés";

    }


    return genero;

}


// =====================================================
// NOMBRE BONITO DE CATEGORÍA
// =====================================================

function nombreCategoria(categoria) {

    if (!categoria) {
        return "";
    }


    const valor =
        normalizarCategoria(categoria);


    if (valor === "perfumes") {

        return "Colonias y perfumes";

    }


    if (valor === "maquillaje") {

        return "Maquillaje";

    }


    if (valor === "cremas") {

        return "Cremas";

    }


    if (valor === "shampoo") {

        return "Shampoo";

    }


    if (valor === "cuidado") {

        return "Cuidado personal";

    }


    return categoria;

}


// =====================================================
// MOSTRAR PRODUCTOS
// =====================================================

function mostrarProductos(
    lista,
    incluirOfertas = false
) {

    const contenedor =
        document.getElementById(
            "lista-productos"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML = "";


    const productosMostrar =
        incluirOfertas
            ?
            lista
            :
            lista.filter(function(producto) {

                return producto.oferta !== true;

            });


    if (productosMostrar.length === 0) {

        contenedor.innerHTML = `

            <div class="sin-productos">

                <h3>
                    😔 No encontramos productos
                </h3>

                <p>
                    Prueba con otro filtro.
                </p>

            </div>

        `;

        return;

    }


    productosMostrar.forEach(function(producto) {


        const precioFinal =
            calcularPrecioOferta(producto);


        // =================================================
        // PRECIO
        // =================================================

        let precioHTML = "";


        if (producto.oferta === true) {

            precioHTML = `

                <div class="precios">

                    <span class="precio-anterior">

                        ${formatoPrecio(
                            producto.precio
                        )}

                    </span>


                    <span class="precio">

                        ${formatoPrecio(
                            precioFinal
                        )}

                    </span>

                </div>

            `;

        } else {

            precioHTML = `

                <p class="precio">

                    ${formatoPrecio(
                        producto.precio
                    )}

                </p>

            `;

        }


        // =================================================
        // ETIQUETA OFERTA
        // =================================================

        let etiquetaOferta = "";


        if (producto.oferta === true) {

            etiquetaOferta = `

                <span class="etiqueta-oferta">

                    -${calcularDescuentoVisual(
                        producto
                    )}%

                </span>

            `;

        }


        // =================================================
        // IMAGEN
        // =================================================

        let imagen =
            producto.imagen ||
            "imagenes/logo.png";


        // =================================================
        // TARJETA
        // =================================================

        contenedor.innerHTML += `

            <article
                class="producto"
                data-marca="${producto.marca}"
                data-genero="${producto.genero}"
                data-categoria="${producto.categoria}"
                data-id="${producto.id}"
            >


                <div class="imagen-producto">

                    ${etiquetaOferta}


                    <img
                        src="${imagen}"
                        alt="${producto.nombre}"
                        loading="lazy"
                        onerror="this.src='imagenes/logo.png'"
                    >

                </div>


                <p class="marca-producto">

                    ${nombreMarca(
                        producto.marca
                    )}

                </p>


                <span class="genero-producto">

                    ${nombreGenero(
                        producto.genero
                    )}

                </span>


                <h3>

                    ${producto.nombre}

                </h3>


                ${precioHTML}


                <button
                    class="comprar"
                    onclick="agregarAlCarrito(${producto.id})"
                >

                    🛍️ Agregar al carrito

                </button>


            </article>

        `;

    });

}


// =====================================================
// MOSTRAR OFERTAS
// =====================================================

function mostrarOfertas() {

    const contenedor =
        document.getElementById(
            "lista-ofertas"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML = "";


    const ofertas =
        productos.filter(function(producto) {

            return producto.oferta === true;

        });


    if (ofertas.length === 0) {

        contenedor.innerHTML = `

            <div class="sin-productos">

                <h3>
                    No hay ofertas disponibles
                </h3>

                <p>
                    Próximamente tendremos nuevas promociones.
                </p>

            </div>

        `;

        return;

    }


    ofertas.forEach(function(producto) {


        const precioFinal =
            calcularPrecioOferta(producto);


        contenedor.innerHTML += `

            <article class="producto oferta-card">


                <div class="imagen-producto">


                    <span class="etiqueta-oferta">

                        -${calcularDescuentoVisual(
                            producto
                        )}%

                    </span>


                    <img
                        src="${
                            producto.imagen ||
                            "imagenes/logo.png"
                        }"
                        alt="${producto.nombre}"
                        loading="lazy"
                        onerror="this.src='imagenes/logo.png'"
                    >


                </div>


                <p class="marca-producto">

                    ${nombreMarca(
                        producto.marca
                    )}

                </p>


                <span class="genero-producto">

                    ${nombreGenero(
                        producto.genero
                    )}

                </span>


                <h3>

                    ${producto.nombre}

                </h3>


                <div class="precios">


                    <span class="precio-anterior">

                        ${formatoPrecio(
                            producto.precio
                        )}

                    </span>


                    <span class="precio">

                        ${formatoPrecio(
                            precioFinal
                        )}

                    </span>


                </div>


                <button
                    class="comprar"
                    onclick="agregarAlCarrito(${producto.id})"
                >

                    🛍️ Agregar al carrito

                </button>


            </article>

        `;

    });

}


// =====================================================
// MOSTRAR TODOS
// =====================================================

function mostrarTodos() {

    mostrarProductos(productos);

}


// =====================================================
// FILTRAR POR MARCA
// =====================================================

function filtrarMarca(marca) {

    const marcaNormalizada =
        String(marca)
            .trim()
            .toLowerCase();


    const resultados =
        productos.filter(function(producto) {

            return (
                String(producto.marca)
                    .trim()
                    .toLowerCase()
                ===
                marcaNormalizada
            );

        });


    mostrarProductos(resultados);


    desplazarProductos();

}


// =====================================================
// FILTRAR POR GÉNERO
// =====================================================

function filtrarGenero(genero) {

    const generoNormalizado =
        normalizarGenero(genero);


    const resultados =
        productos.filter(function(producto) {

            return (
                normalizarGenero(
                    producto.genero
                )
                ===
                generoNormalizado
            );

        });


    mostrarProductos(resultados);


    desplazarProductos();

}


// =====================================================
// FILTRAR MARCA + GÉNERO
// =====================================================

function filtrarMarcaGenero(
    marca,
    genero
) {

    const marcaNormalizada =
        String(marca)
            .trim()
            .toLowerCase();


    const generoNormalizado =
        normalizarGenero(genero);


    const resultados =
        productos.filter(function(producto) {

            return (

                String(producto.marca)
                    .trim()
                    .toLowerCase()
                ===
                marcaNormalizada

                &&

                normalizarGenero(
                    producto.genero
                )
                ===
                generoNormalizado

            );

        });


    mostrarProductos(resultados);


    desplazarProductos();

}


// =====================================================
// FILTRAR CATEGORÍA
// =====================================================

function filtrarCategoria(categoria) {

    const categoriaNormalizada =
        normalizarCategoria(categoria);


    const resultados =
        productos.filter(function(producto) {

            return (
                normalizarCategoria(
                    producto.categoria
                )
                ===
                categoriaNormalizada
            );

        });


    mostrarProductos(resultados);


    desplazarProductos();

}


// =====================================================
// FILTRAR CATEGORÍA + GÉNERO
// =====================================================

function filtrarCategoriaGenero(
    categoria,
    genero
) {

    const categoriaNormalizada =
        normalizarCategoria(categoria);


    const generoNormalizado =
        normalizarGenero(genero);


    const resultados =
        productos.filter(function(producto) {

            return (

                normalizarCategoria(
                    producto.categoria
                )
                ===
                categoriaNormalizada

                &&

                normalizarGenero(
                    producto.genero
                )
                ===
                generoNormalizado

            );

        });


    mostrarProductos(resultados);


    desplazarProductos();

}


// =====================================================
// MOSTRAR SOLAMENTE OFERTAS
// =====================================================

function mostrarSoloOfertas() {

    const ofertas =
        productos.filter(function(producto) {

            return producto.oferta === true;

        });


    mostrarProductos(
        ofertas,
        true
    );


    desplazarProductos();

}


// =====================================================
// DESPLAZAR A PRODUCTOS
// =====================================================

function desplazarProductos() {

    const seccion =
        document.getElementById(
            "productos"
        );


    if (seccion) {

        seccion.scrollIntoView({

            behavior: "smooth"

        });

    }

}


// =====================================================
// AGREGAR AL CARRITO
// =====================================================

function agregarAlCarrito(id) {

    const producto =
        productos.find(function(producto) {

            return producto.id === id;

        });


    if (!producto) {

        console.error(
            "Producto no encontrado:",
            id
        );

        return;

    }


    const productoExistente =
        carrito.find(function(producto) {

            return producto.id === id;

        });


    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({

            id:
                producto.id,

            marca:
                producto.marca,

            nombre:
                producto.nombre,

            genero:
                producto.genero,

            precio:
                calcularPrecioOferta(
                    producto
                ),

            imagen:
                producto.imagen,

            cantidad:
                1

        });

    }


    actualizarCarrito();


    abrirCarrito();


    mostrarMensajeAgregado(
        producto
    );

}


// =====================================================
// ACTUALIZAR CARRITO
// =====================================================

function actualizarCarrito() {

    const contenido =
        document.getElementById(
            "contenido-carrito"
        );


    const subtotalElemento =
        document.getElementById(
            "subtotal-carrito"
        );


    const contador =
        document.getElementById(
            "contador-carrito"
        );


    if (!contenido) {

        return;

    }


    contenido.innerHTML = "";


    if (carrito.length === 0) {

        contenido.innerHTML = `

            <div class="carrito-vacio">


                <div class="icono-carrito-vacio">

                    🛒

                </div>


                <h3>

                    Tu carrito está vacío

                </h3>


                <p>

                    Agrega productos para realizar tu pedido.

                </p>


            </div>

        `;


        if (subtotalElemento) {

            subtotalElemento.textContent =
                "$0";

        }


        if (contador) {

            contador.textContent =
                "0";

        }


        return;

    }


    let cantidadTotal = 0;

    let subtotal = 0;


    carrito.forEach(function(producto) {


        cantidadTotal +=
            producto.cantidad;


        subtotal +=
            producto.precio *
            producto.cantidad;


        contenido.innerHTML += `

            <div class="item-carrito">


                <img
                    src="${
                        producto.imagen ||
                        "imagenes/logo.png"
                    }"
                    alt="${producto.nombre}"
                    onerror="this.src='imagenes/logo.png'"
                >


                <div class="info-item-carrito">


                    <p class="marca-carrito">

                        ${nombreMarca(
                            producto.marca
                        )}

                    </p>


                    <h3>

                        ${producto.nombre}

                    </h3>


                    <strong>

                        ${formatoPrecio(
                            producto.precio
                        )}

                    </strong>


                    <div class="cantidad">


                        <button
                            onclick="cambiarCantidad(${producto.id}, -1)"
                        >

                            −

                        </button>


                        <span>

                            ${producto.cantidad}

                        </span>


                        <button
                            onclick="cambiarCantidad(${producto.id}, 1)"
                        >

                            +

                        </button>


                    </div>


                </div>


                <button
                    class="eliminar-item"
                    onclick="eliminarProducto(${producto.id})"
                    title="Eliminar producto"
                >

                    🗑️

                </button>


            </div>

        `;

    });


    if (subtotalElemento) {

        subtotalElemento.textContent =
            formatoPrecio(subtotal);

    }


    if (contador) {

        contador.textContent =
            cantidadTotal;

    }

}


// =====================================================
// CAMBIAR CANTIDAD
// =====================================================

function cambiarCantidad(
    id,
    cambio
) {

    const producto =
        carrito.find(function(producto) {

            return producto.id === id;

        });


    if (!producto) {

        return;

    }


    producto.cantidad +=
        cambio;


    if (producto.cantidad <= 0) {

        eliminarProducto(id);

        return;

    }


    actualizarCarrito();

}


// =====================================================
// ELIMINAR PRODUCTO
// =====================================================

function eliminarProducto(id) {

    carrito =
        carrito.filter(function(producto) {

            return producto.id !== id;

        });


    actualizarCarrito();

}


// =====================================================
// VACIAR CARRITO
// =====================================================

function vaciarCarrito() {

    if (carrito.length === 0) {

        return;

    }


    const confirmar =
        confirm(
            "¿Seguro que quieres vaciar todo el carrito?"
        );


    if (!confirmar) {

        return;

    }


    carrito = [];


    actualizarCarrito();

}


// =====================================================
// ABRIR CARRITO
// =====================================================

function abrirCarrito() {

    const panel =
        document.getElementById(
            "panel-carrito"
        );


    const fondo =
        document.getElementById(
            "fondo-carrito"
        );


    if (panel) {

        panel.classList.add(
            "activo"
        );

    }


    if (fondo) {

        fondo.classList.add(
            "activo"
        );

    }


    document.body.classList.add(
        "carrito-abierto"
    );

}


// =====================================================
// CERRAR CARRITO
// =====================================================

function cerrarCarrito() {

    const panel =
        document.getElementById(
            "panel-carrito"
        );


    const fondo =
        document.getElementById(
            "fondo-carrito"
        );


    if (panel) {

        panel.classList.remove(
            "activo"
        );

    }


    if (fondo) {

        fondo.classList.remove(
            "activo"
        );

    }


    document.body.classList.remove(
        "carrito-abierto"
    );

}


// =====================================================
// MENSAJE AL AGREGAR
// =====================================================

function mostrarMensajeAgregado(
    producto
) {

    const mensaje =
        document.createElement(
            "div"
        );


    mensaje.className =
        "mensaje-carrito";


    mensaje.innerHTML = `

        🛍️ <strong>

            ${producto.nombre}

        </strong>

        fue agregado al carrito.

    `;


    document.body.appendChild(
        mensaje
    );


    setTimeout(function() {

        mensaje.classList.add(
            "mostrar"
        );

    }, 10);


    setTimeout(function() {

        mensaje.classList.remove(
            "mostrar"
        );


        setTimeout(function() {

            mensaje.remove();

        }, 300);

    }, 2200);

}


// =====================================================
// CALCULAR TOTAL
// =====================================================

function calcularTotal() {

    return carrito.reduce(

        function(total, producto) {

            return total +

                (
                    producto.precio *
                    producto.cantidad
                );

        },

        0

    );

}


// =====================================================
// FINALIZAR PEDIDO POR WHATSAPP
// =====================================================

function finalizarPedido() {

    if (carrito.length === 0) {

        alert(
            "🛒 Tu carrito está vacío."
        );

        return;

    }


    let mensaje =
        "Hola Liseth Jhoana 👋\n\n";


    mensaje +=
        "Quiero realizar el siguiente pedido:\n\n";


    carrito.forEach(
        function(producto, index) {


            const productoOriginal =
                productos.find(
                    function(item) {

                        return item.id === producto.id;

                    }
                );


            mensaje +=
                `${index + 1}. ${nombreMarca(
                    producto.marca
                )} - ${producto.nombre}\n`;


            if (productoOriginal) {

                mensaje +=
                    `Categoría: ${nombreCategoria(
                        productoOriginal.categoria
                    )}\n`;


                mensaje +=
                    `Género: ${nombreGenero(
                        productoOriginal.genero
                    )}\n`;

            }


            mensaje +=
                `Cantidad: ${producto.cantidad}\n`;


            mensaje +=
                `Precio unitario: ${formatoPrecio(
                    producto.precio
                )}\n`;


            mensaje +=
                `Subtotal: ${formatoPrecio(
                    producto.precio *
                    producto.cantidad
                )}\n\n`;

        }
    );


    mensaje +=
        "━━━━━━━━━━━━━━━━\n";


    mensaje +=
        `TOTAL: ${formatoPrecio(
            calcularTotal()
        )}\n\n`;


    mensaje +=
        "¿Me puedes confirmar disponibilidad y precio?";


    const url =
        "https://wa.me/" +
        NUMERO_WHATSAPP +
        "?text=" +
        encodeURIComponent(
            mensaje
        );


    window.open(
        url,
        "_blank"
    );

}


// =====================================================
// EVENTOS
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {


        // =================================================
        // CARGAR PRODUCTOS
        // =================================================

        cargarProductosSupabase();


        // =================================================
        // INICIALIZAR CARRITO
        // =================================================

        actualizarCarrito();


        // =================================================
        // BOTÓN CARRITO
        // =================================================

        const botonCarrito =
            document.getElementById(
                "boton-carrito"
            );


        if (botonCarrito) {

            botonCarrito.addEventListener(
                "click",
                abrirCarrito
            );

        }


        // =================================================
        // CERRAR CARRITO
        // =================================================

        const botonCerrar =
            document.getElementById(
                "cerrar-carrito"
            );


        if (botonCerrar) {

            botonCerrar.addEventListener(
                "click",
                cerrarCarrito
            );

        }


        // =================================================
        // FONDO CARRITO
        // =================================================

        const fondo =
            document.getElementById(
                "fondo-carrito"
            );


        if (fondo) {

            fondo.addEventListener(
                "click",
                cerrarCarrito
            );

        }


        // =================================================
        // VACIAR CARRITO
        // =================================================

        const botonVaciar =
            document.getElementById(
                "vaciar-carrito"
            );


        if (botonVaciar) {

            botonVaciar.addEventListener(
                "click",
                vaciarCarrito
            );

        }


        // =================================================
        // FINALIZAR PEDIDO
        // =================================================

        const botonFinalizar =
            document.getElementById(
                "finalizar-pedido"
            );


        if (botonFinalizar) {

            botonFinalizar.addEventListener(
                "click",
                finalizarPedido
            );

        }

    }
);
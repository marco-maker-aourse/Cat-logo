const STORAGE_KEY = "ecoshop_inventario";
const THEME_KEY = "ecoshop_theme";

const inventarioBase = [
  {
    id: 1,
    nombre: "Auriculares Bluetooth Pro",
    precio: 159.9,
    categoria: "tecnologia",
    stock: 8,
    imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    descripcion: "Auriculares inalámbricos con sonido envolvente y diseño premium.",
  },
  {
    id: 2,
    nombre: "Smartwatch Fit",
    precio: 229.9,
    categoria: "tecnologia",
    stock: 6,
    imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    descripcion: "Reloj inteligente para controlar actividad física y notificaciones.",
  },
  {
    id: 3,
    nombre: "Teclado Mecánico RGB",
    precio: 189.9,
    categoria: "tecnologia",
    stock: 7,
    imagen: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80",
    descripcion: "Teclado mecánico con iluminación RGB y switches de alto rendimiento.",
  },
  {
    id: 4,
    nombre: "Lámpara LED Moderna",
    precio: 79.9,
    categoria: "hogar",
    stock: 10,
    imagen: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    descripcion: "Lámpara minimalista de bajo consumo para escritorio o habitación.",
  },
  {
    id: 5,
    nombre: "Silla Ergonómica",
    precio: 399.9,
    categoria: "hogar",
    stock: 4,
    imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
    descripcion: "Silla cómoda para trabajo, estudio o setup profesional.",
  },
  {
    id: 6,
    nombre: "Organizador de Escritorio",
    precio: 39.9,
    categoria: "hogar",
    stock: 12,
    imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    descripcion: "Organizador elegante para útiles, documentos y accesorios.",
  },
  {
    id: 7,
    nombre: "Zapatillas Running",
    precio: 169.9,
    categoria: "deportes",
    stock: 9,
    imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    descripcion: "Zapatillas ligeras para correr con buena amortiguación.",
  },
  {
    id: 8,
    nombre: "Mat de Yoga",
    precio: 69.9,
    categoria: "deportes",
    stock: 13,
    imagen: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=80",
    descripcion: "Mat antideslizante ideal para yoga, pilates y entrenamiento.",
  },
  {
    id: 9,
    nombre: "Bicicleta Urbana",
    precio: 1299.9,
    categoria: "deportes",
    stock: 3,
    imagen: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80",
    descripcion: "Bicicleta ligera para ciudad y recorridos diarios.",
  },
  {
    id: 10,
    nombre: "Mochila Antirrobo",
    precio: 119.9,
    categoria: "hogar",
    stock: 6,
    imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    descripcion: "Mochila moderna con compartimentos seguros para laptop.",
  },
  {
    id: 11,
    nombre: "Mouse Inalámbrico",
    precio: 49.9,
    categoria: "tecnologia",
    stock: 11,
    imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
    descripcion: "Mouse ergonómico inalámbrico con alta precisión.",
  },
  {
    id: 12,
    nombre: "Botella Térmica",
    precio: 45.9,
    categoria: "deportes",
    stock: 15,
    imagen: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
    descripcion: "Botella reutilizable de acero inoxidable para bebidas frías o calientes.",
  },
];

let inventario = JSON.parse(localStorage.getItem(STORAGE_KEY)) || inventarioBase;
let categoriaActual = "todas";
let busquedaActual = "";
let productoSeleccionadoId = null;

const grid = document.getElementById("grilla-productos");
const inputBusqueda = document.getElementById("input-busqueda");
const botonesFiltro = document.querySelectorAll(".btn-filtro");
const statTotal = document.getElementById("stat-total-items");
const statValor = document.getElementById("stat-valor-total");
const modal = document.getElementById("panel-detalle");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
const btnTheme = document.getElementById("btn-theme-toggle");

const detalleImagen = document.getElementById("detalle-imagen");
const detalleNombre = document.getElementById("detalle-nombre");
const detalleCategoria = document.getElementById("detalle-categoria");
const detallePrecio = document.getElementById("detalle-precio");
const detalleStock = document.getElementById("detalle-stock");

function guardarInventario() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventario));
}

function obtenerProductosFiltrados() {
  return inventario.filter((producto) => {
    const coincideCategoria =
      categoriaActual === "todas" || producto.categoria === categoriaActual;

    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busquedaActual.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });
}

function renderProductos() {
  const productos = obtenerProductosFiltrados();
  grid.innerHTML = "";

  if (productos.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No se encontraron productos</h3>
        <p>Prueba con otra categoría o búsqueda.</p>
      </div>
    `;
    return;
  }

  productos.forEach((producto, index) => {
    const card = document.createElement("article");
    card.className = `product-card ${producto.stock === 0 ? "agotado" : ""}`;
    card.style.animationDelay = `${index * 70}ms`;

    card.innerHTML = `
      <div class="card-img">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        ${producto.stock === 0 ? `<span class="sold-out">Agotado</span>` : ""}
      </div>

      <div class="card-info">
        <span class="category">${producto.categoria}</span>
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>

        <div class="card-meta">
          <strong>S/ ${producto.precio.toFixed(2)}</strong>
          <span>Stock: ${producto.stock}</span>
        </div>

        <div class="card-actions">
          <button class="btn-detail" data-id="${producto.id}">
            Ver detalle
          </button>

          <button class="btn-buy" data-id="${producto.id}" ${
            producto.stock === 0 ? "disabled" : ""
          }>
            Comprar
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  document.querySelectorAll(".btn-buy").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      comprarProducto(Number(btn.dataset.id));
    });
  });

  document.querySelectorAll(".btn-detail").forEach((btn) => {
    btn.addEventListener("click", () => {
      mostrarDetalle(Number(btn.dataset.id));
    });
  });

  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      document
        .querySelectorAll(".product-card")
        .forEach((c) => c.classList.remove("selected"));

      card.classList.add("selected");
    });
  });
}

function comprarProducto(id) {
  inventario = inventario.map((producto) => {
    if (producto.id !== id) return producto;

    return {
      ...producto,
      stock: producto.stock > 0 ? producto.stock - 1 : 0,
    };
  });

  guardarInventario();
  renderApp();
}

function mostrarDetalle(id) {
  const producto = inventario.find((item) => item.id === id);
  if (!producto) return;

  productoSeleccionadoId = id;

  detalleImagen.src = producto.imagen;
  detalleNombre.textContent = producto.nombre;
  detalleCategoria.textContent = producto.categoria;
  detallePrecio.textContent = `S/ ${producto.precio.toFixed(2)}`;
  detalleStock.textContent =
    producto.stock > 0 ? `Stock disponible: ${producto.stock}` : "Producto agotado";

  modal.classList.remove("modal-hidden");
  modal.classList.add("modal-visible");
}

function cerrarModal() {
  modal.classList.add("modal-hidden");
  modal.classList.remove("modal-visible");
}

function actualizarEstadisticas() {
  const totalProductos = inventario.length;

  const valorTotal = inventario.reduce(
    (total, producto) => total + producto.precio * producto.stock,
    0
  );

  statTotal.textContent = totalProductos;
  statValor.textContent = `S/ ${valorTotal.toFixed(2)}`;
}

function configurarEventos() {
  inputBusqueda.addEventListener("input", (e) => {
    busquedaActual = e.target.value.trim();
    renderProductos();
  });

  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      botonesFiltro.forEach((btn) => btn.classList.remove("active"));
      boton.classList.add("active");

      categoriaActual = boton.dataset.categoria;
      renderProductos();
    });
  });

  btnCerrarModal.addEventListener("click", cerrarModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });

  btnTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");

    btnTheme.textContent = isDark ? "Modo Claro" : "Modo Oscuro";
  });
}

function cargarTema() {
  const temaGuardado = localStorage.getItem(THEME_KEY);

  if (temaGuardado === "dark") {
    document.body.classList.add("dark-mode");
    btnTheme.textContent = "Modo Claro";
  }
}

function renderApp() {
  renderProductos();
  actualizarEstadisticas();

  if (productoSeleccionadoId) {
    const existe = inventario.find((p) => p.id === productoSeleccionadoId);
    if (existe && modal.classList.contains("modal-visible")) {
      mostrarDetalle(productoSeleccionadoId);
    }
  }
}

cargarTema();
configurarEventos();
renderApp();
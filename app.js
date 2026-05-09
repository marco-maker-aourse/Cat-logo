// Catálogo extendido con imágenes HD y precios en Soles
const stockInicial = [
    { id: 1, nombre: "Mochila Solar Pro", precio: 245.00, categoria: "hogar", stock: 10, imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600" },
    { id: 2, nombre: "Laptop Bamboo V2", precio: 3800.00, categoria: "tecnología", stock: 5, imagen: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600" },
    { id: 3, nombre: "Kit Pesas Bio", precio: 189.99, categoria: "deportes", stock: 8, imagen: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600" },
    { id: 4, nombre: "Lámpara Solar LED", precio: 85.50, categoria: "hogar", stock: 15, imagen: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600" },
    { id: 5, nombre: "Teclado Reciclado", precio: 155.00, categoria: "tecnología", stock: 12, imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600" },
    { id: 6, nombre: "Yoga Mat Natural", precio: 95.00, categoria: "deportes", stock: 2, imagen: "https://images.unsplash.com/photo-1592432676556-28203042c161?w=600" },
    { id: 7, nombre: "Botella Acero Inox", precio: 45.00, categoria: "hogar", stock: 20, imagen: "https://images.unsplash.com/photo-1602143399827-7211bb1ad050?w=600" },
    { id: 8, nombre: "Audífonos Eco-Buds", precio: 320.00, categoria: "tecnología", stock: 6, imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" },
    { id: 9, nombre: "Set Cubiertos Bamboo", precio: 25.00, categoria: "hogar", stock: 30, imagen: "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=600" },
    { id: 10, nombre: "Cámara Solar 4K", precio: 450.00, categoria: "tecnología", stock: 3, imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600" },
    { id: 11, nombre: "Balón Basket Bio", precio: 120.00, categoria: "deportes", stock: 0, imagen: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600" },
    { id: 12, nombre: "Mesa Terraza Roble", precio: 850.00, categoria: "hogar", stock: 4, imagen: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600" },
    { id: 13, nombre: "Smartwatch Green", precio: 299.00, categoria: "tecnología", stock: 7, imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600" },
    { id: 14, nombre: "Zapatillas Bio-Rec", precio: 310.00, categoria: "deportes", stock: 9, imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" },
    { id: 15, nombre: "Silla Ergonomía Eco", precio: 540.00, categoria: "hogar", stock: 6, imagen: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600" },
    { id: 16, nombre: "Altavoz Bluetooth Madera", precio: 175.00, categoria: "tecnología", stock: 11, imagen: "https://images.unsplash.com/photo-1589003020612-61a010255e14?w=600" }
];

let inventario = JSON.parse(localStorage.getItem('ecoShop_v3')) || stockInicial;

const grilla = document.getElementById('grilla-productos');
const template = document.getElementById('template-tarjeta').content;
const inputBusqueda = document.getElementById('input-busqueda');
const btnFiltros = document.querySelectorAll('.btn-filter');
const modalBS = new bootstrap.Modal(document.getElementById('panel-detalle'));
let categoriaActual = 'todas';

// --- FUNCIONES CORE ---

const actualizarIU = () => {
    grilla.innerHTML = '';
    const query = inputBusqueda.value.toLowerCase();

    const filtrados = inventario.filter(p => {
        const matchesName = p.nombre.toLowerCase().includes(query);
        const matchesCat = categoriaActual === 'todas' || p.categoria === categoriaActual;
        return matchesName && matchesCat;
    });

    filtrados.forEach(p => {
        const clone = template.cloneNode(true);
        const card = clone.querySelector('.product-card');
        
        clone.querySelector('.product-img').src = p.imagen;
        clone.querySelector('.product-title').textContent = p.nombre;
        clone.querySelector('.category-badge').textContent = p.categoria;
        clone.querySelector('.product-price').textContent = `S/ ${p.precio.toFixed(2)}`;
        clone.querySelector('.product-stock').textContent = p.stock;
        
        const btn = clone.querySelector('.btn-comprar');
        btn.dataset.id = p.id;

        if (p.stock <= 0) {
            card.classList.add('agotado');
            clone.querySelector('.out-of-stock-mask').classList.remove('hidden');
            btn.disabled = true;
            btn.textContent = "Agotado";
        }

        card.addEventListener('click', () => abrirDetalle(p, card));
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            ejecutarCompra(p.id);
        });

        grilla.appendChild(clone);
    });
    refrescarStats();
};

const ejecutarCompra = (id) => {
    const p = inventario.find(prod => prod.id === id);
    if (p && p.stock > 0) {
        p.stock--;
        guardarLocal();
        actualizarIU();
    }
};

const abrirDetalle = (p, el) => {
    document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');

    document.getElementById('detalle-imagen').src = p.imagen;
    document.getElementById('detalle-nombre').textContent = p.nombre;
    document.getElementById('detalle-categoria').textContent = p.categoria;
    document.getElementById('detalle-precio').textContent = `S/ ${p.precio.toFixed(2)}`;
    document.getElementById('detalle-stock').textContent = p.stock;
    
    modalBS.show();
};

const refrescarStats = () => {
    const total = inventario.length;
    const valor = inventario.reduce((acc, p) => acc + (p.precio * p.stock), 0);
    document.getElementById('stat-total-items').textContent = total;
    document.getElementById('stat-valor-total').textContent = `S/ ${valor.toLocaleString('es-PE', {minimumFractionDigits: 2})}`;
};

const guardarLocal = () => localStorage.setItem('ecoShop_v3', JSON.stringify(inventario));

// --- EVENTOS ---

inputBusqueda.addEventListener('input', actualizarIU);

btnFiltros.forEach(btn => {
    btn.addEventListener('click', () => {
        btnFiltros.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        categoriaActual = btn.dataset.categoria;
        actualizarIU();
    });
});

document.getElementById('btn-theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-bs-theme', newTheme);
    const btn = document.getElementById('btn-theme-toggle');
    btn.querySelector('span').textContent = newTheme === 'light' ? 'Modo Oscuro' : 'Modo Claro';
    btn.querySelector('i').className = newTheme === 'light' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill text-warning';
});

// Inicializar
actualizarIU();
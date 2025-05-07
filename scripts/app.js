let user = null;
let cart = [];
const LIMITE_POR_USUARIO = 5;


document.addEventListener('DOMContentLoaded', () => {
    loadCatalog();
    console.log('Document loaded and catalog loaded');
});

function login() {
    const nickname = document.getElementById('nickname').value;
    if (nickname) {
        user = nickname;
        document.getElementById('login-form').innerHTML = `<p>Bienvenido, ${nickname}</p><button class="cta" onclick="logout()">Logout</button>`;
        renderCart();
        loadCatalog(); 
    }
}

function logout() {
    user = null;
    cart = [];
    document.getElementById('login-form').innerHTML = `
        <h2>Login</h2>
        <label for="nickname">Nickname:</label>
        <input type="text" id="nickname">
        <button class="cta" onclick="login()">Login</button>
    `;
    renderCart();
    loadCatalog();
}

function loadCatalog() {
    console.log('Loading catalog...');
    const catalogContainer = document.getElementById('catalog');
    catalogContainer.innerHTML = ''; 
    catalogo.forEach(item => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="assets/${item.imagen}" alt="${item.nombre}" class="product-image">
            <h3>${item.nombre}</h3>
            <p>${item.descripcion}</p>
            <p>Ubicación: ${item.ubicacion}</p>
            <p>Disponibilidad: ${item.disponibilidad}</p>
            <button class="cta" ${!user ? 'disabled' : ''} onclick="addToCart('${item.codigo}')">Agregar al Carrito</button>
        `;
        catalogContainer.appendChild(productDiv);
    });
}

function addToCart(productCode) {
    const product = catalogo.find(item => item.codigo === productCode);
    if (!product || product.disponibilidad <= 0) {
        alert('Producto no disponible.');
        return;
    }

    if (cart.length > 0) {
        const ubicacionActual = catalogo.find(item => item.codigo === cart[0].codigo).ubicacion;
        if (ubicacionActual !== product.ubicacion) {
            alert('Solo se pueden agregar productos de la misma ubicación al carrito.');
            return;
        }
    }

    let cartItem = cart.find(item => item.codigo === productCode);

    if (cartItem) {
        if (cartItem.cantidad >= LIMITE_POR_USUARIO) {
            alert(`Solo puedes llevar hasta ${LIMITE_POR_USUARIO} unidades de este producto.`);
            return;
        }
        if (product.disponibilidad <= 0) {
            alert('No hay más unidades disponibles.');
            return;
        }

        cartItem.cantidad += 1;
        product.disponibilidad -= 1;
    } else {
        cart.push({ codigo: productCode, nombre: product.nombre, cantidad: 1 });
        product.disponibilidad -= 1;
    }

    renderCart();
    loadCatalog();
}


function renderCart() {
    console.log('Rendering cart...');
    const cartContainer = document.getElementById('cart');
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Carrito vacío</p>';
        return;
    }

    let cartHtml = '<h3>Carrito</h3>';
    cart.forEach(item => {
        const product = catalogo.find(p => p.codigo === item.codigo);
        const cantidadUsuario = item.cantidad;
        const cantidadMaxima = product.stockInicial;
        const disponibilidad = product.disponibilidad;

        const botonMas = (cantidadUsuario < cantidadMaxima && disponibilidad > 0)
            ? `<button class="cta" onclick="updateCart('${item.codigo}', 1)">+</button>`
            : `<span style="margin-left: 10px; color: #c0392b; font-weight: bold;">Stock máximo alcanzado</span>`;

        cartHtml += `
            <div>
                <p>${item.nombre} - Cantidad: ${cantidadUsuario}</p>
                <button class="cta" onclick="updateCart('${item.codigo}', -1)">-</button>
                ${botonMas}
                <button class="cta" onclick="removeFromCart('${item.codigo}')">Eliminar</button>
            </div>
        `;
    });

    cartContainer.innerHTML = cartHtml;
}



function updateCart(productCode, change) {
    const cartItem = cart.find(item => item.codigo === productCode);
    const product = catalogo.find(item => item.codigo === productCode);

    if (!cartItem || !product) return;

    if (change === 1) {
        if (cartItem.cantidad >= LIMITE_POR_USUARIO) {
            alert(`Solo puedes llevar hasta ${LIMITE_POR_USUARIO} unidades de este producto.`);
            return;
        }
        if (product.disponibilidad <= 0) {
            alert('No hay más unidades disponibles.');
            return;
        }

        cartItem.cantidad += 1;
        product.disponibilidad -= 1;
    } else if (change === -1) {
        if (cartItem.cantidad > 0) {
            cartItem.cantidad -= 1;
            product.disponibilidad += 1;

            if (cartItem.cantidad === 0) {
                removeFromCart(productCode);
                return;
            }
        }
    }

    renderCart();
    loadCatalog();
}


function removeFromCart(productCode) {
    console.log('Removing from cart:', productCode);
    const cartItemIndex = cart.findIndex(item => item.codigo === productCode);
    if (cartItemIndex > -1) {
        const product = catalogo.find(item => item.codigo === productCode);
        product.disponibilidad += cart[cartItemIndex].cantidad;
        cart.splice(cartItemIndex, 1);
        renderCart();
        loadCatalog();
    }
}

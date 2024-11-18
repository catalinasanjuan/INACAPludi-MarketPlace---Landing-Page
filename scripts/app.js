let user = null;
let cart = [];

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
        loadCatalog(); // Recargar el catálogo para habilitar los botones
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
    catalogContainer.innerHTML = ''; // Limpiar el catálogo antes de cargar
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
    console.log('Adding to cart:', productCode);
    const product = catalogo.find(item => item.codigo === productCode);
    
    if (cart.length > 0) {
        const cartItem = cart[0];
        const cartProduct = catalogo.find(item => item.codigo === cartItem.codigo);
        if (cartProduct.ubicacion !== product.ubicacion) {
            window.alert('Solo se pueden agregar productos de la misma ubicación al carrito.');
            return;
        }
    }

    if (product && product.disponibilidad > 0) {
        const cartItem = cart.find(item => item.codigo === productCode);
        if (cartItem) {
            if (cartItem.cantidad < product.disponibilidad) {
                cartItem.cantidad += 1;
            }
        } else {
            cart.push({ codigo: productCode, nombre: product.nombre, cantidad: 1 });
        }
        product.disponibilidad -= 1;
        renderCart();
        loadCatalog();
    } else {
        console.log('Product not found or not available');
    }
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
        cartHtml += `
            <div>
                <p>${item.nombre} - Cantidad: ${item.cantidad}</p>
                <button class="cta" onclick="updateCart('${item.codigo}', -1)">-</button>
                <button class="cta" onclick="updateCart('${item.codigo}', 1)">+</button>
                <button class="cta" onclick="removeFromCart('${item.codigo}')">Eliminar</button>
            </div>
        `;
    });
    cartContainer.innerHTML = cartHtml;
}

function updateCart(productCode, change) {
    console.log('Updating cart for product:', productCode, 'Change:', change);
    const cartItem = cart.find(item => item.codigo === productCode);
    if (cartItem) {
        const product = catalogo.find(item => item.codigo === productCode);
        if (change > 0 && cartItem.cantidad < product.disponibilidad) {
            cartItem.cantidad += change;
            product.disponibilidad -= change;
        } else if (change < 0 && cartItem.cantidad > 0) {
            cartItem.cantidad += change;
            product.disponibilidad += change;
        }
        if (cartItem.cantidad <= 0) {
            removeFromCart(productCode);
        }
        renderCart();
        loadCatalog();
    }
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


const btnCart = document.querySelector('.btn-cart');
const containerCartProducts = document.querySelector('.container-cart-products');
const rowProduct = document.querySelector('.row-product');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador');
const productsList = document.querySelector('.prod-list-container');

// Generar cartId único
let cartId = sessionStorage.getItem('cartId');
if (!cartId) {
    cartId = 'cart_' + Math.random().toString(36).substr(2, 9); // Generar ID único
    sessionStorage.setItem('cartId', cartId); // Guardar cartId
}

let allProducts = [];

// Mostrar/ocultar carrito
btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

// Función para obtener el carrito desde el backend
async function getCartFromBackend() {
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${cartId}`);
        const data = await response.json();
        if (data) {
            allProducts = data.products || [];
            showHTML(); // Actualizar la vista del carrito
        }
    } catch (error) {
        console.error("Error al hacer la solicitud al backend: ", error);
    }
}

// Llamamos a esta función para obtener el carrito cuando se carga la página
getCartFromBackend();

// Función para guardar el carrito en el backend
async function saveCartToBackend() {
    try {
        const response = await fetch('http://localhost:5000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cartId,
                products: allProducts,
            }),
        });

        const data = await response.json();
        console.log("Carrito guardado", data);
    } catch (error) {
        console.error("Error al guardar el carrito en el backend: ", error);
    }
}

// Lógica para eliminar productos del carrito
rowProduct.addEventListener('click', e => {
    // Eliminar producto del carrito
    if (e.target.classList.contains('remove')) {
        const product = e.target.closest('.cart-products');
        const title = product.querySelector('.titulo-producto').textContent;

        allProducts = allProducts.filter(product => product.title !== title.trim());
        showHTML();  // Actualiza la vista del carrito
        saveCartToBackend(); // Guardar los cambios en MongoDB
    }

    // Modificar la cantidad de productos
    if (e.target.classList.contains('plus') || e.target.classList.contains('minus')) {
        const product = e.target.closest('.cart-products');
        const title = product.querySelector('.titulo-producto').textContent;
        const currentProduct = allProducts.find(p => p.title === title.trim());

        if (e.target.classList.contains('plus')) {
            currentProduct.quantity++;
        } else if (e.target.classList.contains('minus') && currentProduct.quantity > 1) {
            currentProduct.quantity--;
        }

        showHTML();  // Actualiza la vista del carrito
        saveCartToBackend(); // Guardar los cambios en MongoDB
    }
});

// Función para mostrar el contenido del carrito
function showHTML() {
    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-products');
        containerProduct.innerHTML = `
            <div class="info-cart-products">
                <div class="img-producto">
                <img src="${product.image}" alt="${product.title}">
                </div>
            </div>
            <div class="info-container">
                <div class="info-cart-products">
                        <p class="titulo-producto">${product.title}</p>
                    <span class="precio-carrito">${product.price}</span>
                </div>
                <div class="info-cart-products">
                    <div class="control">
                        <button class="btn minus">-</button>
                        <span class="cantidad-productos">${product.quantity}</span>
                        <button class="btn plus">+</button>
                    </div>
                    <span class="remove">Remove</span>
                </div>
            </div>
        `;

        rowProduct.append(containerProduct);

        total += parseFloat(product.price.slice(1)) * product.quantity;
        totalOfProducts += product.quantity;
    });

    valorTotal.innerText = `$${total.toFixed(2)}`;
    countProducts.innerText = totalOfProducts;
}

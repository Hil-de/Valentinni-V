
const btnCart = document.querySelector('.btn-cart');
const rowProduct = document.querySelector('.row-product');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');
const productsList = document.querySelector('.prod-list-container');
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
    // Esto muestra y oculta el carrito al hacer clic en el ícono del carrito
    containerCartProducts.classList.toggle('hidden-cart');
});



// Generamos un cartId único para la sesión (si no existe)
let cartId = sessionStorage.getItem('cartId');
if (!cartId) {
    cartId = 'cart_' + Math.random().toString(36).substr(2, 9); // Generamos un ID único
    sessionStorage.setItem('cartId', cartId); // Lo guardamos en sessionStorage
}

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


// lógica para mostrar tarjetas con los productos 
const pageTitleElement = document.querySelector('.title-container h1');
const pageDescriptionElement = document.querySelector('.title-container p');

// Obtener el nombre de la página actual desde la URL
const currentPage = window.location.pathname.split('/').pop();  // Extrae el nombre del archivo, ej. 'rings.html' o 'necklaces.html'

// seleccion de la categoria dependiendo de la pagina. 
let category = "";

if (currentPage === "rings.html") {
    category = "Anillos";  
} else if (currentPage === "necklaces.html") {
    category = "Collares";  
} else if (currentPage === "bracelets.html"){
    category = "Brazaletes";
} else if (currentPage === "earrings.html"){
    category = "Pendientes";
} else if (currentPage === "all-products.html"){
    category = "All"
}

fetch('/assets/json/produts.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al cargar los datos");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);  // Verificar si los datos están siendo recibidos correctamente

        // Buscar la categoría seleccionada
        const categoryData = data.categories.find(cat => cat.category === category);
        if (categoryData) {
            pageTitleElement.textContent = categoryData.pageTitle;
            pageDescriptionElement.textContent = categoryData.pageDescription;

            // Filtrar los productos de la categoría seleccionada
            const filteredProducts = categoryData.products;
            const productList = document.querySelector('.prod-list-container');

            // Agregar los productos al HTML
            filteredProducts.forEach(product => {
                const productCard = `
                    <li class="prod-card">
                        <a href="/assets/pages/products.html?id=${product.id}" data-id="${product.id}">
                            <div class="prod-img-content">
                                <img class="p-img" src="${product.img}" alt="${product.name}">
                                <img class="hover-img" src="${product.hoverImg}" alt="${product.name}">
                            </div>
                        </a>
                        <div class="prod-info">
                            <h3 class="prod-name">${product.name}</h3>
                            <span class="prod-price">${product.price}</span>
                            <span class="prod-material">${product.material}</span>
                            <button class="bag-btn">Añadir al carrito</button>
                        </div>
                    </li>
                `;
                productList.innerHTML += productCard;
            });
        } else {
            console.error(`Categoría "${category}" no encontrada.`);
        }
    })
    .catch(error => {
        console.error("Hubo un problema con la carga del archivo JSON: ", error);
    });

let allProducts = [];

// Función para agregar productos al carrito
productsList.addEventListener('click', e => {
    if (e.target.classList.contains('bag-btn')) {
        const productElement = e.target.closest('li');
        const productId = productElement.querySelector('a').getAttribute('data-id');
        const infoProduct = {
            id: productId,
            quantity: 1,
            title: productElement.querySelector('.prod-name').textContent,
            price: productElement.querySelector('.prod-price').textContent,
            image: productElement.querySelector('.prod-img-content img').src,
        };

        const exists = allProducts.some(product => product.title === infoProduct.title);

        if (exists) {
            // Si el producto ya existe, aumentar la cantidad
            allProducts = allProducts.map(product => {
                if (product.title === infoProduct.title) {
                    product.quantity++;
                }
                return product;
            });
        } else {
            // Si el producto no existe, agregarlo al carrito
            allProducts.push(infoProduct);
        }

        showHTML();  // Actualiza la vista del carrito
        saveCartToBackend(); // Guardar el carrito en MongoDB
    }
});

// Lógica para eliminar productos del carrito
rowProduct.addEventListener('click', e => {
    // Si se hace clic en el botón de eliminar producto
    if (e.target.classList.contains('remove')) {
        const product = e.target.closest('.cart-products');
        const title = product.querySelector('.titulo-producto').textContent;

        // Eliminar el producto del carrito
        allProducts = allProducts.filter(product => product.title !== title.trim());
        showHTML();  // Actualiza la vista del carrito
        saveCartToBackend(); // Guardar los cambios en MongoDB
    }

    // Si se hace clic en el botón de aumentar la cantidad "+"
    if (e.target.classList.contains('plus')) {
        const product = e.target.closest('.cart-products');
        const title = product.querySelector('.titulo-producto').textContent;
        
        // Encontrar el producto en el carrito y aumentar la cantidad
        const currentProduct = allProducts.find(p => p.title === title.trim());
        if (currentProduct) {
            currentProduct.quantity++;
            showHTML();  // Actualiza la vista del carrito
            saveCartToBackend(); // Guardar los cambios en MongoDB
        }
    }

    // Si se hace clic en el botón de reducir la cantidad "-"
    if (e.target.classList.contains('minus')) {
        const product = e.target.closest('.cart-products');
        const title = product.querySelector('.titulo-producto').textContent;

        // Encontrar el producto en el carrito
        const currentProduct = allProducts.find(p => p.title === title.trim());
        if (currentProduct && currentProduct.quantity > 1) {
            currentProduct.quantity--;  // Solo reducir si la cantidad es mayor que 1
            showHTML();  // Actualiza la vista del carrito
            saveCartToBackend(); // Guardar los cambios en MongoDB
        }
    }
});

// Función para mostrar el contenido del carrito (actualizada para usar el `id`)
function showHTML() {
    const cartEmpty = document.querySelector('.cart-empty');
    const rowProduct = document.querySelector('.row-product');
    const cartTotal = document.querySelector('.cart-total');
    const valorTotal = document.querySelector('.total-pagar');
    const countProducts = document.querySelector('#contador');

    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    rowProduct.innerHTML = '';  // Limpiar el carrito antes de agregar los nuevos productos

    let total = 0;
    let totalItems = 0;

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
        rowProduct.appendChild(containerProduct);

        total += parseFloat(product.price.slice(1)) * product.quantity;
        totalItems += product.quantity;
    });

    valorTotal.innerText = `$${total.toFixed(2)}`;
    countProducts.innerText = totalItems;
}

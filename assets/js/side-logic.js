// logica del carrito de compras 

//funcion para cambiar color al navbar 

window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;
    const links = document.querySelectorAll('.a_container a');

    links.forEach(link => {
        if (scrollY > 100) {
            link.style.setProperty('--line_color', '#FFFFFF');
        } else {
            link.style.setProperty('--line_color', getComputedStyle(document.documentElement).getPropertyValue('#000000'));
        }
    });
});


const btnCart = document.querySelector('.btn-cart');
const rowProduct = document.querySelector('.row-product');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');
const productsList = document.querySelector('.prod-list-container');
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart')
})

// logica para mostrar tarjetas con los productos 

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
                        <a href="/assets/pages/products.html?id=${product.id}">
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


// Lógica para agregar al carrito (modificada para incluir el `id`)
productsList.addEventListener('click', e => {
    if (e.target.classList.contains('bag-btn')) {
        const productElement = e.target.closest('li');
        const infoProduct = {
            id: productElement.querySelector('a').href.split('=')[1],  // Obtener el `id` desde la URL
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
    }
});

rowProduct.addEventListener('click', e => {
    // Si se hace clic en el botón de eliminar producto
    if (e.target.classList.contains('remove')) {
        const product = e.target.closest('.cart-products');
        const title = product.querySelector('.titulo-producto').textContent;

        // Eliminar el producto del carrito
        allProducts = allProducts.filter(product => product.title !== title.trim());
        showHTML();  // Actualiza la vista del carrito
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
        }
    }
});


// Función para mostrar el contenido del carrito (actualizada para usar el `id`)
function showHTML() {
    if (allProducts.length === 0) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    // Limpiar el contenido previo del carrito
    rowProduct.innerHTML = '';

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
                    <a href="/assets/pages/products.html?id=${product.id}">
                        <p class="titulo-producto">${product.title}</p>
                    </a>
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

        // Calcular el total
        total += parseFloat(product.price.slice(1)) * product.quantity;  // Eliminar "$" y calcular el total
        totalItems += product.quantity;
    });

    // Actualizar el total y el contador de productos
    valorTotal.innerText = `$${total.toFixed(2)}`;
    countProducts.innerText = totalItems;
}

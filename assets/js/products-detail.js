// logica para las paginas de detalle de cada producto con HTML dinamico 

// Ruta al archivo JSON
const jsonFilePath = '/assets/json/produts.json';

// Función para obtener el ID del producto desde la URL
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')); // Devuelve el valor del parámetro "id" como número
}

// Función para cargar y mostrar los detalles del producto
async function loadProductDetails() {
    try {
        const response = await fetch(jsonFilePath);
        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.statusText}`);
        }
        const data = await response.json();

        // Obtener el ID del producto desde la URL
        const productId = getProductIdFromURL();
        if (!productId) {
            console.error('No se encontró el ID del producto en la URL.');
            return;
        }

        let product = null;
        let categoryName = null;

        // Buscar el producto por ID en todas las categorías
        for (const category of data.categories) {
            // Buscar en cada categoría
            product = category.products.find(prod => prod.id === productId);
            if (product) {
                categoryName = category.category; // Guardar el nombre de la categoría
                break; // Salir del ciclo cuando el producto se encuentra
            }
        }

        if (!product) {
            console.error(`Producto con ID ${productId} no encontrado.`);
            return;
        }

        // Poblar los datos en el HTML
        document.getElementById('product_img').src = product.img;
        document.getElementById('product_img2').src = product.hoverImg;
        document.getElementById('product_name').textContent = product.name;
        document.getElementById('price').textContent = product.price;
        document.getElementById('details').textContent = product.detail || 'N/A';
        document.getElementById('description').textContent = product.description || 'N/A';
        document.getElementById('materials').textContent = product.material || 'N/A';
        
        // Puedes también mostrar el nombre de la categoría si lo necesitas
        document.getElementById('category_name').textContent = categoryName || 'Categoría no encontrada';

    } catch (error) {
        console.error('Error al cargar los detalles del producto:', error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', loadProductDetails);

// Logica del carrito de compras 


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
//funcion para cambiar color al navbar 

//ocultar carrito de compras

const btnCart = document.querySelector('.btn-cart')
const containerCartProducts = document.querySelector('.container-cart-products') 

btnCart.addEventListener('click', () => {
containerCartProducts.classList.toggle('hidden-cart')
})

/* ========================= */
const cartInfo = document.querySelector('.cart-products');
const rowProduct = document.querySelector('.row-product');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

// Lista de todos los contenedores de productos
const productsList = document.querySelector('.prod-list-container');

// Variable de arreglos de Productos
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');

const countProducts = document.querySelector('#contador');


// agregar datos al carrito en la pagina de detalles de productos 

const addToBagButtons = document.querySelectorAll('.ad_to_bag_buttom');

addToBagButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const productContainer = e.target.closest('.products_details_container');
        
        // Obtener los detalles del producto
        const productInfo = {
            quantity: 1,
            title: productContainer.querySelector('#product_name').textContent,
            price: productContainer.querySelector('#price').textContent,
            image: productContainer.querySelector('#product_img').src,
        };

        // Verificar si el producto ya está en el carrito
        const exists = allProducts.some(product => product.title === productInfo.title);

        if (exists) {
            // Si ya existe, aumentar la cantidad
            allProducts = allProducts.map(product => {
                if (product.title === productInfo.title) {
                    product.quantity++;
                }
                return product;
            });
        } else {
            // Si no existe, agregarlo al carrito
            allProducts.push(productInfo);
        }

        // Actualizar la interfaz del carrito
        showHTML();
    });
});



// Eliminar productos 
rowProduct.addEventListener('click', e => {
	if (e.target.classList.contains('remove')){
        const product = e.target.closest('.cart-products');
        const title = product.querySelector('.titulo-producto').textContent;

        allProducts = allProducts.filter(
            product => product.title !== title.trim()
        );

        console.log(allProducts);

        showHTML();
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
    }
});

// Funcion para mostrar  HTML
const showHTML = () => {
    // verifica si no hay productos
    if (!allProducts.length) {
        // Mostrar mensaje de carrito vacío
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        // Ocultar mensaje de carrito vacío
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }
    // Limpiar HTML
    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-products');

        containerProduct.innerHTML = `
                <div class="info-cart-products">
                    <div class="img-producto">
                        <a href="/assets/pages/products.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.title}">
                    </a>
                    </div>
                </div>

                <div class="info-container">[]
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

        total = total + parseInt(product.quantity * product.price.slice(1));
        totalOfProducts = totalOfProducts + product.quantity;
    });

    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalOfProducts;
};





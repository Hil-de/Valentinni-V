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


productsList.addEventListener('click', e => {
    if (e.target.classList.contains('bag-btn')) {
        const product = e.target.closest('li');

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('.prod-name').textContent,
            price: product.querySelector('.prod-price').textContent,
            image: product.querySelector('.prod-img-content img').src,
        };

        const exits = allProducts.some(
            product => product.title === infoProduct.title
        );

        if (exits) {
            const products = allProducts.map(product => {
                if (product.title === infoProduct.title) {
                    product.quantity++;
                    return product;
                } else {
                    return product;
                }
            });
            allProducts = [...products];
        } else {
            allProducts = [...allProducts, infoProduct];
        }

        showHTML();
    }
});


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

        total = total + parseInt(product.quantity * product.price.slice(1));
        totalOfProducts = totalOfProducts + product.quantity;
    });

    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalOfProducts;
};




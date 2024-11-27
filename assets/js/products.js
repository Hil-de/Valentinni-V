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

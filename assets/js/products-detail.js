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

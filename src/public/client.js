const socket = io();

function addProduct() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const code = document.getElementById('code').value;
  const price = parseFloat(document.getElementById('price').value);
  const stock = parseInt(document.getElementById('stock').value);
  const category = document.getElementById('category').value;


socket.on('updateProductList'), (products) => {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';}



  socket.emit('newProduct', { title, description, code, price, stock, category });


const CART_ID_FIJO = '66a6a6a6a6a6a6a6a6a6a6a6'; 


// Función para agregar un producto al carrito
async function addProductToCart(productId) {
    if (!CART_ID_FIJO || CART_ID_FIJO.includes('66a6a6a6')) {
        alert("Error: Define primero un ID de carrito válido.");
        return;
    }

    try {
        const response = await fetch(`/api/carts/${CART_ID_FIJO}/product/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
           
        });

        const data = await response.json();

        if (response.ok) {
            alert(`✅ Producto agregado al carrito ${CART_ID_FIJO}!`);
            console.log('Carrito actualizado:', data);
        } else {
            alert(`❌ Error al agregar producto: ${data.error || 'Intente de nuevo.'}`);
        }
    } catch (error) {
        console.error('Error de red o servidor:', error);
        alert('Hubo un error al comunicarse con el servidor.');
    }
}

// Escuchador de eventos general para los botones en products.handlebars y productDetail.handlebars
document.addEventListener('click', (e) => {
    
    if (e.target.classList.contains('btn-add-cart')) {
        const productId = e.target.getAttribute('data-product-id');
        if (productId) {
            addProductToCart(productId);
        }
    }

    if (e.target.classList.contains('btn-add-cart-detail')) {
        const productId = e.target.getAttribute('data-product-id');
        if (productId) {
            addProductToCart(productId);
        }
    }
    
});



}
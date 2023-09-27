// Función para agregar un producto al carrito
function agregarAlCarrito(productId, productName) {
  // Puedes realizar lógica para agregar el producto al carrito aquí
  // Por ejemplo, puedes mantener un arreglo de productos en el carrito

  // Agregar el producto al contenedor del carrito
  const carritoContainer = document.getElementById('carritoProductos');
  const productoDiv = document.createElement('div');
  productoDiv.textContent = productName;
  carritoContainer.appendChild(productoDiv);
}

// Obtén todos los elementos <a> con el atributo data-product-id
const addToCartLinks = document.querySelectorAll('a[data-product-id]');

// Agrega un evento de clic a cada enlace "Agregar al Carrito"
addToCartLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // Evita la navegación a la URL "#" por defecto

    // Obtiene el ID del producto desde el atributo data-product-id
    const productId = link.getAttribute('data-product-id');

    // Obtén el nombre del producto (puedes obtenerlo de donde sea necesario)
    const productName = link.getAttribute('data-product-name');

    // Agrega el producto al carrito y actualiza la vista del carrito
    agregarAlCarrito(productId, productName);
  });
});
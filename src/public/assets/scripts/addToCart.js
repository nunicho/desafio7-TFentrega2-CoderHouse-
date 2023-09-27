document.addEventListener("DOMContentLoaded", function () {
  // Obtén los enlaces "Agregar al Carrito"
  const addToCartLinks = document.querySelectorAll("[data-product-id]");

  // Obtén el botón "Limpiar Carrito"
  const limpiarCarritoButton = document.getElementById("limpiarCarrito");

  // Función para agregar un producto al carrito
  function agregarAlCarrito(productId, productName) {
    // Crear un div para contener el ítem del carrito
    const itemDiv = document.createElement("div");

    // Crear un elemento de texto para mostrar el nombre del producto
    const productNameText = document.createTextNode(productName);
    itemDiv.appendChild(productNameText);

    // Crear un elemento <input> para seleccionar la cantidad
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.min = 1;
    quantityInput.value = 1; // Establece el valor predeterminado a 1
    itemDiv.appendChild(quantityInput);

    // Agregar el producto al contenedor del carrito
    const carritoContainer = document.getElementById("carritoProductos");
    carritoContainer.appendChild(itemDiv);
  }

  // Función para limpiar el carrito
  function limpiarCarrito() {
    const carritoContainer = document.getElementById("carritoProductos");
    carritoContainer.innerHTML = ""; // Limpia el contenido del contenedor
  }

  // Agrega un evento de clic al botón "Limpiar Carrito"
  limpiarCarritoButton.addEventListener("click", () => {
    limpiarCarrito();
  });

  // Agrega un evento de clic a cada enlace "Agregar al Carrito"
  addToCartLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Evita la navegación a la URL "#" por defecto

      // Obtiene el ID del producto desde el atributo data-product-id
      const productId = link.getAttribute("data-product-id");

      // Obtén el nombre del producto desde el atributo data-product-name
      const productName = link.getAttribute("data-product-name");

      // Agrega el producto al carrito y actualiza la vista del carrito
      agregarAlCarrito(productId, productName);
    });
  });
});

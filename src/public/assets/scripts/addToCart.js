document.addEventListener("DOMContentLoaded", function () {
  // Obtén el botón "Limpiar Carrito"
  const limpiarCarritoButton = document.getElementById("limpiarCarrito");

  // Obtén el botón "Finalizar Compra"
  const finalizarCompraButton = document.getElementById("finalizarCompra");

  // Obtén el contenedor del carrito
  const carritoContainer = document.getElementById("carritoProductos");

  // Array para almacenar los productos en el carrito
  const carritoProductos = [];

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
  carritoContainer.appendChild(itemDiv);

  // Agregar un evento de cambio al input para actualizar la cantidad en el array
  quantityInput.addEventListener("change", () => {
    const quantity = parseInt(quantityInput.value, 10);
    const index = carritoProductos.findIndex((item) => item.id === productId);
    if (index !== -1) {
      carritoProductos[index].quantity = quantity;
    }
  });

  // Agregar el producto al array del carrito con la cantidad adecuada (inicialmente 1)
  carritoProductos.push({ id: productId, quantity: 1 });
}

  // Función para limpiar el carrito
  function limpiarCarrito() {
    // Limpiar el contenedor del carrito
    carritoContainer.innerHTML = "";

    // Limpiar el array del carrito
    carritoProductos.length = 0;
  }

  // Agrega un evento de clic al botón "Limpiar Carrito"
  limpiarCarritoButton.addEventListener("click", () => {
    limpiarCarrito();
  });

  // Agrega un evento de clic al botón "Finalizar Compra"
  finalizarCompraButton.addEventListener("click", () => {
    // Realizar la petición POST al servidor con la ruta "/api/DBcarts"
    fetch("/api/DBcarts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products: carritoProductos }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Manejar la respuesta del servidor después de la compra
        console.log("Compra finalizada:", data);

        // Limpiar el carrito después de la compra
        limpiarCarrito();
      })
      .catch((error) => {
        console.error("Error al finalizar la compra:", error);
      });
  });

  // Agrega un evento de clic a cada enlace "Agregar al Carrito"
  const addToCartLinks = document.querySelectorAll("[data-product-id]");
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



/*
document.addEventListener("DOMContentLoaded", function () {
  // Obtén el botón "Limpiar Carrito"
  const limpiarCarritoButton = document.getElementById("limpiarCarrito");

  // Obtén el botón "Finalizar Compra"
  const finalizarCompraButton = document.getElementById("finalizarCompra");

  // Obtén el contenedor del carrito
  const carritoContainer = document.getElementById("carritoProductos");

  // Array para almacenar los productos en el carrito
  const carritoProductos = [];

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
    carritoContainer.appendChild(itemDiv);

    // Agregar el producto al array del carrito
    carritoProductos.push({ id: productId, quantity: 100 });
  }

  // Función para limpiar el carrito
  function limpiarCarrito() {
    // Limpiar el contenedor del carrito
    carritoContainer.innerHTML = "";

    // Limpiar el array del carrito
    carritoProductos.length = 0;
  }

  // Agrega un evento de clic al botón "Limpiar Carrito"
  limpiarCarritoButton.addEventListener("click", () => {
    limpiarCarrito();
  });

  // Agrega un evento de clic al botón "Finalizar Compra"
  finalizarCompraButton.addEventListener("click", () => {
    // Realizar la petición POST al servidor con la ruta "/api/DBcarts"
    fetch("/api/DBcarts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products: carritoProductos }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Manejar la respuesta del servidor después de la compra
        console.log("Compra finalizada:", data);

        // Limpiar el carrito después de la compra
        limpiarCarrito();
      })
      .catch((error) => {
        console.error("Error al finalizar la compra:", error);
      });
  });

  // Agrega un evento de clic a cada enlace "Agregar al Carrito"
  const addToCartLinks = document.querySelectorAll("[data-product-id]");
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

*/
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

  // Buscar si el producto ya está en el carrito
  const existingProductIndex = carritoProductos.findIndex(
    (product) => product.id === productId
  );

  if (existingProductIndex !== -1) {
    // Si el producto ya está en el carrito, actualiza la cantidad
    quantityInput.value = carritoProductos[existingProductIndex].quantity;
  }

  // Agregar un evento de cambio al input para actualizar la cantidad en el array
  quantityInput.addEventListener("change", () => {
    const quantity = parseInt(quantityInput.value, 10);

    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito, actualiza la cantidad en el array
      carritoProductos[existingProductIndex].quantity = quantity;
    } else {
      // Si el producto no estaba en el carrito, agrégalo con la cantidad actual
      carritoProductos.push({ id: productId, quantity });
    }
  });
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
alert(`Carrito ${data.carritoInsertado._id} creado exitosamente`);
        // Verificar si la compra fue exitosa y se creó el carrito
        if (data.carritoInsertado && data.carritoInsertado._id) {
          // Muestra un mensaje de alerta con el ID del carrito
          alert(`Carrito ${data.carritoInsertado._id} creado exitosamente`);
        }

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
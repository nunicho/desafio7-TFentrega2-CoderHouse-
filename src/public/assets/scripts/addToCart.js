// Escucha el evento de clic en el botón "Agregar al Carrito"
document.addEventListener("click", function (event) {
  // Verifica si se hizo clic en un botón con la clase "agregar-al-carrito"
  if (event.target.classList.contains("agregar-al-carrito")) {
    // Obtiene el ID del producto desde el atributo de datos del botón
    const productId = event.target.dataset.productid;

    // Obtiene la cantidad deseada del producto (puedes obtenerla de un input)
    const quantity = parseInt(prompt("Ingrese la cantidad deseada:"));

    // Verifica si la cantidad es válida
    if (isNaN(quantity) || quantity <= 0) {
      alert("La cantidad ingresada no es válida.");
      return;
    }

    // Crea un objeto con los datos del producto a agregar al carrito
    const productToAdd = {
      id: productId,
      quantity: quantity,
    };

    // Realiza una solicitud POST al servidor para agregar el producto al carrito
    fetch("/api/agregar-al-carrito", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productToAdd),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Producto agregado al carrito con éxito.");
        } else {
          alert("Error al agregar el producto al carrito.");
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
        alert("Hubo un error al conectar con el servidor.");
      });
  }
});

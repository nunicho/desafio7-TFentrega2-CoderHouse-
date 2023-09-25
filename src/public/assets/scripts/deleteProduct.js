// Obtén todos los enlaces "Eliminar" por su clase "eliminar-producto"
const eliminarBotones = document.querySelectorAll(".eliminar-producto");

// Agrega un manejador de eventos a cada enlace
eliminarBotones.forEach((enlace) => {
  enlace.addEventListener("click", function (event) {
    event.preventDefault(); // Evita que el enlace realice una solicitud GET

    const productId = this.getAttribute("data-product-id"); // Obtiene el ID del producto

    // Realiza una solicitud DELETE al servidor
    fetch(`/productDelete/${productId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 200) {
          // Redirige a la página "DBproducts" después de la eliminación exitosa
          window.location.href = "/DBproducts";
        } else {
          // Maneja cualquier error o respuesta no exitosa aquí
        }
      })
      .catch((error) => {
        // Maneja errores de red u otros errores aquí
      });
  });
});

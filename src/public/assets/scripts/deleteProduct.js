// Obtén todos los enlaces "Eliminar" por su clase "eliminar-producto"
const eliminarBotones = document.querySelectorAll(".eliminar-producto");

eliminarBotones.forEach((enlace) => {
  enlace.addEventListener("click", function (event) {
    event.preventDefault();

    const productId = this.getAttribute("data-product-id");

    fetch(`/api/products/${productId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 200) {
          window.location.href = "/DBproducts";
        } else {
        }
      })
      .catch((error) => {});
  });
});

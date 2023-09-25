
  // Agrega un evento click al botón de limpiar
document
  .getElementById("limpiarFiltros")
  .addEventListener("click", function () {
    // Limpia los valores de los campos de filtro
    document.getElementById("filtro").value = "";
    document.getElementById("codeFilter").value = "";

    // Envía el formulario para eliminar los filtros y volver a cargar la página
    document.getElementById("filtroForm").submit();
  });

// Agrega un evento click al botón de limpiar
// Agrega un evento click al botón de limpiar
document.getElementById("limpiarFiltros").addEventListener("click", function () {
  // Limpia los valores de los campos de filtro
  document.getElementById("filtro").value = "";
  document.getElementById("codeFilter").value = "";

  // Elimina los parámetros de filtro y límite de la URL
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.delete("filtro");
  currentURL.searchParams.delete("limit");
  window.location.href = currentURL.href;
});








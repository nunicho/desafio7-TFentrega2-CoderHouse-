const mongoose = require("mongoose");

const carritosColeccion = "carritos";
const productoCarritoSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto", 
  },
  quantity: Number,
});

const carritoEsquema = new mongoose.Schema({
  products: [productoCarritoSchema],
});

const carritoModelo = mongoose.model(carritosColeccion, carritoEsquema);

module.exports = carritoModelo;

/*
const mongoose = require("mongoose");
const productosModelo = require("./productos.modelo.js"); // Asegúrate de proporcionar la ruta correcta

// Define el esquema para los productos dentro del carrito
const productoCarritoSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: productosModelo, // "Producto" debe coincidir con el nombre del modelo en productos.modelo.js
  },
  quantity: Number,
});

// Define el esquema para el carrito que contiene productos
const carritoSchema = new mongoose.Schema({
  products: [productoCarritoSchema], // Los productos van dentro del carrito como un arreglo de subdocumentos
});

const carritoModelo = mongoose.model("Carrito", carritoSchema);

module.exports = carritoModelo;
*/


/*
v
*/
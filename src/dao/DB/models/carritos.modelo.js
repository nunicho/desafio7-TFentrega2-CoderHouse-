const mongoose = require("mongoose");
const Producto = require("../models/productos.modelo.js");

const carritoSchema = new mongoose.Schema({
  productos: {
    type: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Producto,
        },
        cantidad: Number, // Agrega el campo cantidad
      },
    ],
  },
});

const carritoModelo = mongoose.model("carritos", carritoSchema);

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

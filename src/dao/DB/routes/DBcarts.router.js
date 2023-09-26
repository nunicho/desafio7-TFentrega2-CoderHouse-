const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const carritosModelo = require("../models/carritos.modelo.js"); // Importa el modelo de carritos
const Producto = require("../models/productos.modelo.js"); // Importa el modelo de Producto
const path = require("path");
//const carritoModelo = require("../models/carritos.modelo.js");

//------------------------------------------------------------------------ PETICION GET

router.get("/", async (req, res) => {
  try {
    const carritos = await carritosModelo.find(); // Obtén todos los carritos

    res.status(200).json({ data: carritos });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//------------------------------------------------------------------------ PETICION GET con /:ID

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        status: "error",
        mensaje: 'Requiere un argumento "cid" de tipo numérico',
      });
    }

    const carrito = await carritosModelo.findOne({ _id: cid }).populate({
      path: "products",
      populate: {
        path: "product",
        model: Producto, // Nombre del modelo de productos
        populate: {
          path: "code",
        },
      },
    });

    if (!carrito) {
      return res.status(404).json({
        status: "error",
        mensaje: `El carrito con ID ${cid} no existe`,
      });
    }

    res.status(200).json({ data: carrito });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

   
//------------------------------------------------------------------------ PETICION POST

router.post("/", async (req, res) => {
  try {
    const carritoToAdd = req.body;

    // Verificar si falta algún campo 'id' o 'quantity' en algún producto
    const hasMissingFields = carritoToAdd.products.some(
      (product) => !product.id || !product.quantity
    );

    if (hasMissingFields || carritoToAdd.products.length === 0) {
      return res.status(400).json({
        error: 'Los productos deben tener campos "id" y "quantity" completos',
      });
    }
    // Verificar que el ID sea válido según los parámetros de MongoDB

    // Verificar si los productos existen en la base de datos
    const productIds = carritoToAdd.products.map((product) => product.id);

    for (const productId of productIds) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "id inválido" });
      }
    }

    const existe = await Producto.findOne({ _id: { $in: productIds } });

    if (!existe) {
      return res
        .status(400)
        .json({ error: "Algunos artículos no existen en la base de datos" });
    }
    // Sumar la cantidad de productos con el mismo id
    const groupedProducts = {};
    carritoToAdd.products.forEach((product) => {
      const { id, quantity } = product;
      if (!groupedProducts[id]) {
        groupedProducts[id] = quantity;
      } else {
        groupedProducts[id] += quantity;
      }
    });

    // Crear un nuevo carrito con las cantidades agrupadas
    const carrito = new carritosModelo({
      products: Object.keys(groupedProducts).map((id) => ({
        id: id,
        quantity: groupedProducts[id],
      })),
      
    });
    
    let carritoInsertado = await carrito.save();
    res.status(201).json({ carritoInsertado });


  } catch (error) {
    res.status(500).json({ error: "Error inesperado", detalle: error.message });
  }
});


//-------------------------------------------------- PETICION DELETE api/dbcarts/:cid/products/:pid 

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid; // ID del carrito
    const pid = req.params.pid; // ID del producto a eliminar

    // Verifica si los IDs son válidos
    if (
      !mongoose.Types.ObjectId.isValid(cid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      return res.status(400).json({
        error: "IDs inválidos",
      });
    }

    // Busca el carrito por su ID
    const carrito = await carritosModelo.findOne({ _id: cid });

    // Verifica si el carrito existe
    if (!carrito) {
      return res.status(404).json({
        error: `El carrito con ID ${cid} no existe`,
      });
    }

    // Busca el índice del producto que se va a eliminar dentro del array de productos
    const indexToDelete = carrito.products.findIndex(
      (product) => product.id === pid
    );

    // Verifica si el producto a eliminar existe en el carrito
    if (indexToDelete === -1) {
      return res.status(404).json({
        error: `El producto con ID ${pid} no existe en el carrito`,
      });
    }

    // Elimina el producto del array de productos del carrito
    carrito.products.splice(indexToDelete, 1);

    // Guarda el carrito actualizado en la base de datos
    const carritoActualizado = await carrito.save();

    res.status(200).json({
      mensaje: "Producto eliminado del carrito",
      carrito: carritoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error inesperado",
      detalle: error.message,
    });
  }
});




module.exports = router;

/*
const express = require("express");
const router = express.Router();
const carritosModelo = require("../models/carritos.modelo.js"); // Importa el modelo de Mongoose
const productosModelo = require("../models/productos.modelo.js");
const path = require("path");

const mongoose = require("mongoose");

//------------------------------------------------------------------------ PETICION GET

router.get("/", async (req, res) => {
  try {
    const carritos = await carritosModelo.find(); // Obtén todos los carritos

    res.status(200).json({ data: carritos });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//------------------------------------------------------------------------ PETICION GET con /:ID

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
 
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        status: "error",
        mensaje: 'Requiere un argumento "cid" de tipo numérico',
      });
    }

    const carrito = await carritosModelo.findOne({ _id: cid });

    if (!carrito) {
      return res.status(404).json({
        status: "error",
        mensaje: `El id ${cid} no existe`,
      });
    }

    res.status(200).json({ data: carrito });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//------------------------------------------------------------------------ PETICION POST

router.post("/", async (req, res) => {
  try {
    const carritoToAdd = req.body;

    // Verificar si falta algún campo 'id' o 'quantity' en algún producto
    const hasMissingFields = carritoToAdd.products.some(
      (product) => !product.id || !product.quantity
    );

    if (hasMissingFields || carritoToAdd.products.length === 0) {
      return res.status(400).json({
        error: "Los productos deben tener campos 'id' y 'quantity' completos",
      });
    }
    // Verificar que el ID sea válido según los parámetros de MongoDB

    // Verificar si los productos existen en la base de datos
    const productIds = carritoToAdd.products.map((product) => product.id);

    for (const productId of productIds) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "id inválido" });
      }
    }

    const existe = await productosModelo.findOne({ _id: { $in: productIds } });

    if (!existe) {
      return res
        .status(400)
        .json({ error: `Algunos artículos no existen en la base de datos` });
    }
    // Sumar la cantidad de productos con el mismo id
    const groupedProducts = {};
    carritoToAdd.products.forEach((product) => {
      const { id, quantity } = product;
      if (!groupedProducts[id]) {
        groupedProducts[id] = quantity;
      } else {
        groupedProducts[id] += quantity;
      }
    });

    // Crear un nuevo carrito con las cantidades agrupadas
    const carrito = new carritosModelo({
      products: Object.keys(groupedProducts).map((id) => ({
        id: id,
        quantity: groupedProducts[id],
      })),
    });

    let carritoInsertado = await carrito.save();
    res.status(201).json({ carritoInsertado });
  } catch (error) {
    res.status(500).json({ error: "Error inesperado", detalle: error.message });
  }
});

module.exports = router;

*/

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const carritosModelo = require("../models/carritos.modelo.js"); // Importa el modelo de carritos
const Producto = require("../models/productos.modelo.js"); // Importa el modelo de Producto
const path = require("path");
const prodModelo = require("../models/productos.modelo.js");
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
        mensaje: 'Requiere un argumento "cid" de tipo ObjectId válido',
      });
    }

    const carrito = await carritosModelo
      .findOne({ _id: cid })
      .populate({
        path: "productos.producto",
        model: prodModelo,
      });

    if (!carrito) {
      return res.status(404).json({
        status: "error",
        mensaje: `El carrito con ID ${cid} no existe`,
      });
    }

    // No es necesario mapear los productos en un nuevo arreglo
    // Simplemente utiliza carrito.productos en la respuesta
    res.status(200).json({ data: { carrito } });
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

    // Sumar la cantidad de productos con el mismo id
    const groupedProducts = {};
    carritoToAdd.products.forEach((product) => {
      const { id, quantity } = product;
      if (!groupedProducts[id]) {
        groupedProducts[id] = parseInt(quantity, 10); // Asegúrate de convertir quantity a número
      } else {
        groupedProducts[id] += parseInt(quantity, 10); // Asegúrate de convertir quantity a número
      }
    });

    // Crear un nuevo carrito con las cantidades agrupadas
    const carrito = new carritosModelo({
      productos: Object.keys(groupedProducts).map((id) => ({
        producto: id, // Cambia "id" a "producto"
        cantidad: groupedProducts[id], // Agrega cantidad
      })),
    });

    let carritoInsertado = await carrito.save();
    res.status(201).json({ carritoInsertado });
  } catch (error) {
    res.status(500).json({ error: "Error inesperado", detalle: error.message });
  }
});


//------------------------------------------------------------------------ PETICION PUT api/DBcarts/:cid

router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid; // ID del carrito a actualizar
    const nuevosProductos = req.body.products; // Arreglo de nuevos productos

    // Verifica si el ID del carrito es válido
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        error: "ID de carrito inválido",
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

    // Verifica si el arreglo de nuevos productos es válido
    if (!Array.isArray(nuevosProductos)) {
      return res.status(400).json({
        error: "El cuerpo de la solicitud debe contener un arreglo de productos",
      });
    }

    // Verifica si hay datos faltantes en los nuevos productos
    const datosFaltantes = nuevosProductos.some(
      (product) => !product.id || !product.quantity
    );

    if (datosFaltantes) {
      return res.status(400).json({
        error: "Los nuevos productos deben contener campos 'id' y 'quantity'",
      });
    }

    // Verifica si los IDs de los nuevos productos son válidos
    const productIds = nuevosProductos.map((product) => product.id);

    for (const productId of productIds) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "ID de producto inválido" });
      }
    }

    // Actualiza los productos del carrito con los nuevos productos
    carrito.products = nuevosProductos;

    // Guarda el carrito actualizado en la base de datos
    const carritoActualizado = await carrito.save();

    res.status(200).json({
      mensaje: "Carrito actualizado con éxito",
      carrito: carritoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error inesperado",
      detalle: error.message,
    });
  }
});


//------------------------------------------------------------------------ PETICION PUT api/DBcarts/:cid/products/:pid

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid; // ID del carrito a actualizar
    const pid = req.params.pid; // ID del producto a actualizar
    const { quantity } = req.body; // Cantidad de ejemplares del producto a actualizar

    // Verifica si se proporcionaron todos los parámetros necesarios
    if (!cid || !pid || !quantity) {
      return res.status(400).json({
        error:
          "Todos los parámetros deben estar completos: cid, pid y quantity",
      });
    }

    // Resto del código para actualizar la cantidad del producto en el carrito...

    // Respuesta exitosa...
  } catch (error) {
    res.status(500).json({
      error: "Error inesperado",
      detalle: error.message,
    });
  }
});


//-------------------------------------------------- PETICION DELETE api/dbcarts/:cid

router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid; // ID del carrito a eliminar

    // Verifica si el ID del carrito es válido
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        error: "ID de carrito inválido",
      });
    }

    // Busca y elimina el carrito por su ID
    const carritoEliminado = await carritosModelo.findByIdAndDelete(cid);

    // Verifica si el carrito existe
    if (!carritoEliminado) {
      return res.status(404).json({
        error: `El carrito con ID ${cid} no existe`,
      });
    }

    res.status(200).json({
      mensaje: "Carrito eliminado con éxito",
      carrito: carritoEliminado,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error inesperado",
      detalle: error.message,
    });
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

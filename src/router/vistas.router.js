const Router = require("express").Router;
const router = Router();
const arrayProducts = require("../archivos/productos.json");
const productosModelo = require("../dao/DB/models/productos.modelo.js");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("home", {
    titlePage: "Home Page de la ferretería El Tornillo",
    estilo: "styles.css",
  });
});


//---------------------------------------------------------------- RUTAS EN FILESYSTEM --------------- //

router.get("/fsproducts", (req, res) => {
  let index = parseInt(req.query.index) || 0;
  const array = arrayProducts;
  const totalProducts = array.length;

  const lastIndex = array.length - 1;

  if (index < 0) {
    index = lastIndex;
  } else if (index >= totalProducts) {
    index = 0;
  }

  const product = array[index];

  res.header("Content-type", "text/html");
  res.status(200).render("FSproducts", {
    product: product,
    index: index,
    titlePage: "Página de productos",
    estilo: "productsStyles.css",
  });
});

router.get("/fsrealtimeproducts", (req, res) => {
  let index = parseInt(req.query.index) || 0;
  const array = arrayProducts;
  const totalProducts = array.length;

  const lastIndex = array.length - 1;

  if (index < 0) {
    index = lastIndex;
  } else if (index >= totalProducts) {
    index = 0;
  }

  const product = array[index];

  res.header("Content-type", "text/html");
  res.status(200).render("realTimeProducts", {
    product: product,
    index: index,
    titlePage: "Página de productos en tiempo real",
    estilo: "realTimeProducts.css",
  });
});


//---------------------------------------------------------------- RUTAS PARA MONGO --------------- //


router.get("/DBproducts", async (req, res) => {
  try {
    let pagina = req.query.pagina || 1; // Establece la página predeterminada como 1
    let filtroTitle = req.query.filtro; // Obtén el filtro de título de la consulta
    let filtroCode = req.query.codeFilter; // Obtén el filtro de código de la consulta

    let query = {}; // Define un objeto de consulta vacío

    if (filtroTitle && filtroCode) {
      // Si se proporcionan ambos filtros, construye la consulta con ambos filtros
      query = {
        $or: [
          { title: { $regex: filtroTitle, $options: "i" } },
          { code: { $regex: filtroCode, $options: "i" } },
        ],
      };
    } else if (filtroTitle) {
      // Si solo se proporciona un filtro de título, usa ese filtro
      query = { title: { $regex: filtroTitle, $options: "i" } };
    } else if (filtroCode) {
      // Si solo se proporciona un filtro de código, usa ese filtro
      query = { code: { $regex: filtroCode, $options: "i" } };
    }

    let productos = await productosModelo.paginate(query, {
      limit: 5,
      lean: true,
      page: pagina,
    });

    let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
      productos;

    res.header("Content-type", "text/html");
    res.status(200).render("DBproducts", {
      productos: productos.docs,
      hasProducts: productos.docs.length > 0,
      activeProduct: true,
      pageTitle: "Productos en DATABASE",
      estilo: "productsStyles.css",
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/*
router.get("/DBproducts", async (req, res) => {
  try {
    //const productos = await productosModelo.find().lean();

    let pagina = req.query.pagina
    if(!pagina) pagina =1
   
    let productos = await productosModelo.paginate({},{limit:5, lean: true, page:pagina});
    console.log(productos)

    let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = productos;

    res.header("Content-type", "text/html");
    res.status(200).render("DBproducts", {
      productos: productos.docs,
      hasProducts: productos.docs.length > 0,
      activeProduct: true,
      pageTitle: "Productos en DATABASE",
      estilo: "productsStyles.css",
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
*/
router.get("/DBproducts/:id", async (req, res) => {
  let id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: "id inválido" });

  let productoDB = await productosModelo.findById(id).lean();

  if (!productoDB)
    return res.status(404).json({ error: `Producto con id ${id} inexistente` });

  res.status(200).render("DBproductsDetails", {
    productoDB,
    // title: productoDB.title,
    // description: productoDB.description,
    // price: productoDB.price,
    // thumbnail: productoDB.thumbnail ,
    // code: productoDB.code,
    // stock: productoDB.stock,
    // estilo: "realTimeProducts.css"
  });
});


router.post("/DBProducts", async (req, res) => {
  let producto = req.body;
  if (
    !producto.title ||
    !producto.description ||
    !producto.price ||
    !producto.thumbnail ||
    !producto.code ||
    !producto.stock
  )
    return res.status(400).json({ error: "Faltan datos" });

  let existe = await productosModelo.findOne({ code: producto.code });
  if (existe)
    return res.status(400).json({
      error: `El código ${producto.code} ya está siendo usado por otro producto.`,
    });

  try {
    let productoInsertado = await productosModelo.create(producto);
    res.status(201).json({ productoInsertado });
  } catch (error) {
    res.status(500).json({ error: "Error inesperado", detalle: error.message });
  }
});

router.delete("/DBproducts/:id", async (req, res) => {
  let id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: "id inválido" });

  let existe = await productosModelo.findById(id);

  if (!existe)
    return res.status(404).json({ error: `Producto con id ${id} inexistente` });
  let resultado = await productosModelo.deleteOne({ _id: id });

  res.status(200).json({ resultado });
  
});

module.exports = router;


module.exports = router;


//---------------------------------------------------------------- RUTAS PARA EL CHAT --------------- //

router.get("/chat", (req, res) => {  
    res.setHeader("Content-type", "text/html");
    res.status(200).render("chat", {
      estilo: "chat.css",
    });
    
});

module.exports = router;



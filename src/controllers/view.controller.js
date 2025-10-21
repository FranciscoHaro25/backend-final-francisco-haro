const ProductService = require("../services/product.service");
const CartService = require("../services/cart.service");

const productService = new ProductService();
const cartService = new CartService();

class ViewController {
  async renderHome(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sort,
        query,
        category,
        availability,
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: Math.min(parseInt(limit), 20),
        sort,
        query,
        category,
        availability,
      };

      const result = await productService.list(options);

      // Determinar si tenemos paginación
      const hasPagination = result.docs !== undefined;
      const products = hasPagination ? result.docs : result;

      // Función para construir enlaces de página
      const buildPageLink = (pageNum) => {
        const queryParams = new URLSearchParams(req.query);
        queryParams.set("page", pageNum);
        return `${req.path}?${queryParams.toString()}`;
      };

      // Preparar datos para la vista
      const viewData = {
        title: "Mi Tienda - Home",
        products,
        hasProducts: products.length > 0,
        // Datos de paginación
        pagination: hasPagination
          ? {
              page: result.page,
              totalPages: result.totalPages,
              hasNextPage: result.hasNextPage,
              hasPrevPage: result.hasPrevPage,
              nextPage: result.nextPage,
              prevPage: result.prevPage,
              totalDocs: result.totalDocs,
              limit: result.limit,
              // URLs para navegación
              prevLink: result.hasPrevPage
                ? buildPageLink(result.prevPage)
                : null,
              nextLink: result.hasNextPage
                ? buildPageLink(result.nextPage)
                : null,
            }
          : null,
        // Filtros actuales
        filters: {
          query: query || "",
          category: category || "",
          availability: availability || "",
          sort: sort || "",
        },
        // Ayudantes para la vista
        showPagination: hasPagination && result.totalPages > 1,
      };

      res.render("home", viewData);
    } catch (error) {
      console.error("Error al cargar vista home:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Error al cargar productos",
        error: error.message,
      });
    }
  }

  // Construir enlaces de navegación manteniendo filtros
  buildPageLink(req, page) {
    const queryParams = new URLSearchParams(req.query);
    queryParams.set("page", page);
    return `${req.path}?${queryParams.toString()}`;
  }

  // Renderizar vista de productos en tiempo real
  async renderRealTimeProducts(req, res) {
    try {
      const result = await productService.list({});

      // Extraer productos según el formato de respuesta
      const products = result.docs || result;

      res.render("realTimeProducts", {
        title: "Mi Tienda - Productos en Tiempo Real",
        products,
        hasProducts: products.length > 0,
      });
    } catch (error) {
      console.error("Error al cargar vista realTimeProducts:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Error al cargar productos en tiempo real",
        error: error.message,
      });
    }
  }

  // Renderizar vista de carrito específico
  async renderCart(req, res) {
    try {
      const { cid } = req.params;

      const cart = await cartService.getCartWithProducts(cid);

      res.render("cart", {
        title: "Mi Tienda - Carrito",
        cart,
        hasProducts: cart.products.length > 0,
        cartId: cid,
      });
    } catch (error) {
      console.error("Error al cargar vista del carrito:", error);
      if (error.message.includes("no encontrado")) {
        return res.status(404).render("error", {
          title: "Carrito no encontrado",
          message: "El carrito solicitado no existe",
          error: error.message,
        });
      }
      res.status(500).render("error", {
        title: "Error",
        message: "Error al cargar carrito",
        error: error.message,
      });
    }
  }
}

module.exports = new ViewController();

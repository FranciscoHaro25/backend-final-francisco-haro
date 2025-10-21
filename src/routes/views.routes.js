const express = require("express");
const viewController = require("../controllers/view.controller");
const { validateCartId } = require("../middlewares/idValidator");

const router = express.Router();

router.get("/", viewController.renderHome);
router.get("/realtimeproducts", viewController.renderRealTimeProducts);
router.get("/carts/:cid", validateCartId, viewController.renderCart);

module.exports = router;

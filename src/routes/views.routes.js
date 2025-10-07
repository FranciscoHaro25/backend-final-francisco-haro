const express = require("express");
const viewController = require("../controllers/view.controller");

const router = express.Router();

router.get("/", viewController.renderHome);
router.get("/realtimeproducts", viewController.renderRealTimeProducts);

module.exports = router;

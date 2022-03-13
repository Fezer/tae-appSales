const express = require("express");
const saleRouter = express.Router();
const saleController = require("../controllers/saleController");
const auth = require("../middlewares/auth");

saleRouter.get("/listAllSales", auth, saleController.listAllSales);
saleRouter.get("/searchSalesByDate", auth, saleController.searchSalesByDate);
saleRouter.get("/searchSalesBySeller/:id", auth, saleController.searchSalesBySeller);
saleRouter.get("/listTotalSalesByDate", auth, saleController.listTotalSalesByDate);
saleRouter.delete("/deleteSale/:id", auth, saleController.deleteSale);
saleRouter.put("/updateSale/:id", auth, saleController.updateSale);

module.exports = saleRouter;
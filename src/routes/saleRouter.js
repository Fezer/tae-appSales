const express = require("express");
const saleRouter = express.Router();
const saleController = require("../controllers/saleController");

saleRouter.get("/listAllSales", saleController.listAllSales);
saleRouter.get("/searchSalesByDate", saleController.searchSalesByDate);
saleRouter.get("/searchSalesBySeller", saleController.searchSalesBySeller);
saleRouter.get("/listTotalSalesByDate", saleController.listTotalSalesByDate);
saleRouter.put("/updateSale", saleController.updateSale);
saleRouter.delete("/deleteSale", saleController.deleteSale);

module.exports = saleRouter;
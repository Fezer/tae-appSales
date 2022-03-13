const express = require("express");
const sellerRouter = express.Router();
const sellerController = require("../controllers/sellerController");
const auth = require("../middlewares/auth");

sellerRouter.post("/authentication", sellerController.authentication);
sellerRouter.get("/listAllSellers", auth, sellerController.listAllSellers);
sellerRouter.get("/searchSellerByName/:name", auth, sellerController.searchSellerByName);
sellerRouter.post("/newSeller", auth, sellerController.newSeller);
sellerRouter.delete("/deleteSeller/:id", auth, sellerController.deleteSeller);
sellerRouter.put("/updateSeller/:id", auth, sellerController.updateSeller);
sellerRouter.put("/updatePasswordSeller/:id", auth, sellerController.updatePasswordSeller);

module.exports = sellerRouter;
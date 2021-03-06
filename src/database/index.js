const Sequelize = require("sequelize");
const dbConfig = require("./config/dbconfig");

const Seller = require("../models/Seller");
const Sale = require("../models/Sale");

const connection = new Sequelize(dbConfig);

Seller.init(connection);
Sale.init(connection);

Seller.associate(connection.models);
Sale.associate(connection.models);

module.exports = connection;
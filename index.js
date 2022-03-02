const express = require("express");
const app = express();
const router = require("./src/routes/router");
require("./src/database");

//app.unsubscribe(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(router);

app.listen(process.env.SYSTEM_PORT, () => {
    console.log("Server is running at localhost: ",
        process.env.SYSTEM_PORT);
});

module.exports = app;
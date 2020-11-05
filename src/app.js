"use strict"

// Packages
const express = require("express");
const path = require("path");
const app = express();
const env = require("dotenv").config()

// Dependencies
const routes = require("./routes");

// Constants
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, "public")));

/*
 * Place all routes in the routes.js file
 */

app.use("/", routes);

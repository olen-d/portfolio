const express = require("express");
const exphbs = require("express-handlebars");

const app = express();
const port =  process.env.PORT || 3030;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main", helpers: require("./config/hbs_helpers") }));
app.set("view engine", "handlebars");

// Set up the css, js, and images directories
app.use(express.static("public"));

// Import routes and give the server access to them.
const routes = require("./controllers/portfolio_controller.js");
app.use(routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
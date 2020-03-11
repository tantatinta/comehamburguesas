const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "burgers_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("There was an error connecting: " + err.stack);
    return;
  }

  console.log("Connected as id " + connection.threadId);
});

app.get("/", (req, res) => {
  connection.query("SELECT * FROM burgers", (error, data) => {
    if (error) {
      console.log(error)
      return res.status(500).end();
    }
    // res.render("index");
    res.render("index", { burgers: data })
  });
});

//route to "/" with POST to write new item in DB and send refresh response to browser (reload "GET")
app.post("/api/burgers", (req, res) => {
  console.log(req.body);
  
  connection.query("INSERT INTO burgers SET ?", [req.body], (error, result) => {
    if (error) {
      console.log(error)
      return res.status(500).end();
    }
    //ADD RESPONSE OBJECT
    res.json(result);
    
  });
});

app.put("/api/burgers/:id", (req, res) => {
  connection.query("UPDATE burgers SET devoured = true WHERE id = ?", [req.params.id], (error, result) => {
    if (error) {
      return res.status(500).end();      
    }
    else if (!result.changedRows) {
      return res.status(404).end();      
    }
    res.status(200).end();
  });
});

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});
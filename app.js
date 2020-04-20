//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongoose://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true})

//item schema

const itemsSchema =  {
  nameItem: String
};
// model for our items based on schema.

const Item = mongoose.model("Item", itemsSchema);

// documents using model and schema
// doc 1
const item1 = new Item ({

name : "Welcome to your todolist!"
});
//doc 2
const item2 = new Item ({
  name: "Hit the + button to add a new item."
});
//doc 3
const item3 = new Item ({
  name: "<-- Hit this to delete."
});

//now we will store all this item in a new const
const defaultItems = [item1, item2, item3];

//now we will creat insert many to store the item  collections
Item.insertMany (defaultItems, function(err){
  if (err) {
    console.log(err);
  } else{
    console.log("here are the lists of items");
  }
});



app.get("/", function(req, res) {



  res.render("list", {listTitle: "Today", newListItems: items});

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

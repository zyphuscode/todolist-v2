//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _= require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-zehra:test1234@cluster0-xqqqz.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true ,  useFindAndModify: false });

//item schema

const itemsSchema =  {
  name: String
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

//creating a new schema for our new express route

const listSchema = {
  name : String,
  items: [itemsSchema] //embedded array 
}
// model for listSchema

const List = mongoose.model("List", listSchema);

// the document for listschema is at new express route



//now we will creat insert many to store the item  collections
//Item.insertMany (defaultItems, function(err){
 // if (err) {
  //  console.log(err);
//  } else{
 //   console.log("Successfully saved items to the database.");
//  }
//});


//reading from our database with mongoose using find().
//we will tap into our Item model using find and it takes two params.
//we will do this inside our get route 
app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0) {

    Item.insertMany (defaultItems, function(err){
      if (err) {
        console.log(err);
      } else{
      console.log("Successfully saved items to the database.");
      }
    });

    res.redirect("/")
  }else {
    res.render("list", {listTitle: "Today", newListItems: foundItems})
  }

});
  
});

// new routes with express routes paramater
app.get("/:customListName", function(req, res){
  const customListName =_.capitalize(req.params.customListName);


  List.findOne({name: customListName}, function(err, foundList){
    if (!err) {
      if (!foundList){
        //create a list
        const list = new List ({
          name : customListName,
          items : defaultItems
        });
        list.save();
        res.redirect("/" + customListName );

      } else {
        //show an existing list
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
    }
  });


});




//

//post route with monooose

app.post("/", function(req, res){

  const itemName = req.body.newItem; //itemName is a new const
  const listName = req.body.list; //this list corresponds to the name of the button.

  //we will create a new document for itemName;

  const item = new Item({
    name: itemName
  });
  

  //if statement to check whether the items are added on default list or custom list.
  if (listName === "Today"){
    item.save();
  res.redirect("/");

  }else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }


});

//post route to delete items when user checked out the item
app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  //to delete item using their id
  //creating a new const to list items are deleted from which list
  const listName = req.body.listName;


  //now we will create to check
  if(listName === "Today") {
    Item.findByIdAndRemove(checkedItemId , function(err) {
      if (!err) {
        console.log("success");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    })

  }

  
});

app.get("/about", function(req, res){
  res.render("about");
});
//heroku port set up

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});

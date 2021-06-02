var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

// const name ="My Anme Is Amir Bhutta";

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("style"));
app.set("view engine","ejs");



// Data Base Connection.......!!!
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser:true,useUnifiedTopology: true ,useFindAndModify: false});
// Creating Schema......!!
const itemSchema = {
	name: String
};
// Creating Model......!!
const ToDo = mongoose.model("ToDo",itemSchema);
// Creating Three 3 todo......!!
const todo1 = new ToDo({
	name : "Learn Nodejs"
});
const todo2 = new ToDo({
	name : "Sleeping On Time"
});


const defaultItems = [todo1,todo2];



app.get("/", function(req,res){
	ToDo.find({},function(err,foundItems){
		// This Is Used To Check If Database Empty Then Add Default Values/n
		// other wise add Only Default 3 Todos..../n
		// If Not Use This Then Every time we Run Our Project/n
		// it will Add evry time new same 3 todos ....!!
		if(foundItems.length===0){
		   ToDo.insertMany(defaultItems,function(err){
           if(err){
		    console.log(err);
	      }
	      else{
		    console.log("Inserted Successfully!");
	      }
        });
		   res.redirect("/");
		}else{
			//1. console.log(foundItems);
		   res.render("list",{todos:foundItems});
		}	
	});
});

//...Methode For ADD TODO.....!!!
app.post("/addtodo",function(req,res){
	// Method To Add Value Into DataBase ....!!
	const newtodos = req.body.add;
    const newtodo = new ToDo({
    	name: newtodos
    });

   newtodo.save();
   res.redirect("/");
});

// Method For DELETE TODO......!!!!

app.post("/delete",function(req,res){
	const checkedItemId =req.body.checkbox;
	ToDo.findByIdAndRemove(checkedItemId,function(err){
		if(!err){
			console.log("Todo Deleted Successfully!");
			res.redirect("/");
		}
	});
});

app.listen(3000,function(){
	console.log("Server Start On Port 3000");
});
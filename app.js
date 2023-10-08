import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import 'dotenv/config';
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(process.env.url,{useNewUrlParser: true});

const itemSchema = {
    name: String
};
const Item = mongoose.model("Item",itemSchema);
const item1 = new Item({
    name: "Welcome to your todolist!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item."
});
const item3 = new Item({
    name: "<-- Hit this to delete item."
});
const defaultItems = [item1,item2,item3];

app.get("/",(req,res)=>{
var options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
};
var today  = new Date();
Item.find({}).then((fItems)=>{
    if(fItems.length === 0){
        Item.insertMany(defaultItems).then(()=>{
            console.log("data inserted");
        });      
    }else{
        res.render("list.ejs",{date:today.toLocaleDateString("en-US"),list:fItems});
    }
})
});

app.post("/delete",(req,res)=>{
    const chkId = req.body.checkbox;
    Item.findByIdAndRemove(chkId).then(()=>{
        console.log("successfully deleted.")
    })
    res.redirect("/");
    
});

app.post("/",(req,res)=>{
    var newItem = req.body.newItem;
    const item = new Item({
        name: newItem
    })
    item.save();
    res.redirect("/");
});

app.listen(3000, (req,res)=>{
console.log("Server started on port 3000");
});
require('dotenv').config();
const express= require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const User= new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(re,res){
    res.render("login");
})

app.post("/login",async function(req,res){

    const name=req.body.username;
    const password=req.body.password;

    const user= await User.findOne({email:name});
    if(user){
        bcrypt.compare(password, user.password, function(err, result) {
            if(result===true){
                res.render("secrets");
            }
        });
        
    }

})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser=new User({
            email:req.body.username,
            password:hash
        });
        newUser.save();
        res.render("secrets");
    });
    

})

app.listen(3000,function(){
    console.log("Server running at port 3000");
})
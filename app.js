const express= require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption"); 


const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const secret="ThisIsMySecret";
userSchema.plugin(encrypt, { secret: secret,encryptedFields: ["password"]});

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
        if(user.password===password){
            res.render("secrets");
        }
    }

})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save();
    res.render("secrets");

})

app.listen(3000,function(){
    console.log("Server running at port 3000");
})
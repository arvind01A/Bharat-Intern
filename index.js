const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 8000;

//connection to db
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose
    .connect(`mongodb+srv://${username}:${password}@cluster0.sw0yix1.mongodb.net/registrationFormDB`)
    .then( () => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB Error", err));

//Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
},{timestamps: true});

//model
const Registration = mongoose.model("Registration", userSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
})

app.get("/index.html", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register", async (req, res) => {
    try{
        const {name, email, password} = req.body;

        const registrationData = new Registration({
            name,
            email,
            password
        });
        await registrationData.save();

        res.redirect("success");
    }
    catch(error){
        console.log(error);
        res.redirect("error");
    }
})

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
})
app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
})

app.listen(port, () => {
    console.log(`server runnning at ${port}`);
});

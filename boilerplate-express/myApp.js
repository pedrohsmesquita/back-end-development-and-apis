let express = require('express');
let app = express();
let bodyParser = require('body-parser');
require('dotenv').config();

// #11
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// #1
console.log("Hello World");

// #2
//app.get("/", (req, res) => {                      Get Method - String response
//    res.send("Hello Express");
//});

// #7
app.use((req, res, next) => {                       //Middleware function 
    let log = req.method + ' ' + req.path + ' - ' + req.ip;
    console.log(log);
    next();
});

// # 4
app.use("/public", express.static(__dirname + "/public"));

// #3
app.get("/", (req, res) => {                        //Get Method - File (HTML) response
    res.sendFile(__dirname + "/views/index.html");
});

//#5
//app.get("/json", (req, res) => {
//    let response = "Hello json";
//    
//    res.json({"message": response});
//});

// #6
app.get("/json", (req, res) => {
    let response = "Hello json";
    if (process.env.MESSAGE_STYLE === "uppercase")
        response = response.toUpperCase();
    
    res.json({"message": response});
});

// #8
app.get("/now", (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => {
    res.json({"time": req.time});
});

// #9
app.get("/:word/echo", (req, res) => {
    res.json({"echo": req.params.word});
})

// #10
app.get("/name", (req, res) => {
    let name = `${req.query.first} ${req.query.last}`;
    res.json({"name": name});
});

// #12
app.post("/name", (req, res) => {
    let name = `${req.body.first} ${req.body.last}`;
    res.json({"name": name});
})






























 module.exports = app;

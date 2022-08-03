import express from "express"
import bodyParser from "body-parser"
import request from "request"

var app = express()

app.use (bodyParser.urlencoded ({extended: false}));

app.use(bodyParser.json())

app.listen(process.env.PORT || 3210, function(){
    console.log("Server Listen in localhost:3210")
})

app.get("/", function(req, res){
    res.send("Desde el pc")
})

app.get("/webhook", function(req, res){
    console.log(req.query, "hola")
    if(req.query['hub.verify_token'] === "hello_token"){
        console.log(req.query)
        res.send(req.query["hub.challenge"])
    }else{
    res.send("Prueba")
    }
})

app.post("/webhook", function(req, res){
    res.sendStatus(200)
})


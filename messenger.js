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
    if(req.query['hub.verify_token'] === "hello_token"){
        res.send(req.query["hub.challenge"])
    }else{
        res.send("Prueba")
    }
})

app.post("/webhook", function(req, res){
    const data = req.body;
    if(data.object === "page"){
        data.entry.forEach(pageEntry => {
            pageEntry.messaging.forEach(messagingEvent => {
                if(messagingEvent.message){
                    const senderId = messagingEvent.sender.id;
                    const messageText = messagingEvent.message.text;
                    const messageResponseData = {
                        recipient: {
                            id: senderId
                        },
                        message: {
                            text: "Solo se repetir el pinche mensaje alv"
                        }
                    };
    
                    request({
                        uri: "https://graph.facebook.com/v2.6/me/messages",
                        qs: {access_token: process.env.APP_TOKEN},
                        method: "POST",
                        json: messageResponseData
                    }, function (error, response, data){
                        if(error){
                            console.log("No fue posible enviar el mensaje")
                        }else{
                            console.log("Mensaje enviado")
                        }
                    })
                }
            })
        });
    }
    res.sendStatus (200);
})
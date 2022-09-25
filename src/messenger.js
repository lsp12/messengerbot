import express from "express";
import bodyParser from "body-parser";
import request from "request";
/* import "./database.js"; */

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.listen(process.env.PORT || 3210, function () {
  console.log("Server Listen in localhost:3210");
});

app.get("/", function (req, res) {
  res.send("ChatbotMessage");
});

app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === "hello_token") {
    res.send(req.query["hub.challenge"]);
  } else {
    res.send("Prueba");
  }
});

app.post("/webhook", function (req, res) {
  const data = req.body;
  if (data.object === "page") {
    data.entry.forEach((pageEntry) => {
      pageEntry.messaging.forEach((messagingEvent) => {
        if (messagingEvent.message) {
          const senderId = messagingEvent.sender.id;
          let messageText = messagingEvent.message.text;
          if (
            messagingEvent &&
            messagingEvent.message &&
            messagingEvent.message.attachments &&
            messagingEvent.message.attachments.length > 0
          ) {
            console.log(
              messagingEvent.message.attachments[0].payload.coordinates
            );
            //cordenadas
            /* messageText = `Latitud: ${messagingEvent.message.attachments[0].payload.coordinates.lat}, Longitud: ${messagingEvent.message.attachments[0].payload.coordinates.long}`; */
          }

          const messageResponseData = {
            recipient: {
              id: senderId,
            },
            message: {
              attachment: {
                type: "template",
                payload: {
                  template_type: "media",
                  elements: [
                    {
                      media_type: "image",
                      url: "https://assets.puzzlefactory.pl/puzzle/316/243/original.jpg",
                      buttons: [
                        {
                          type: "web_url",
                          url: "https://www.google.com/",
                          title: "View Website",
                        },
                      ],
                    },
                    {
                      media_type: "image",
                      url: "https://i.pinimg.com/564x/f6/e1/90/f6e190ba3a2c8646e634908ba2e1443d.jpg",
                      buttons: [
                        {
                          type: "web_url",
                          url: "https://www.google.com/",
                          title: "View Website",
                        },
                      ],
                    },
                    {
                      media_type: "image",
                      url: "https://i.blogs.es/30d986/cyberpunk-edgerunners/1366_2000.jpeg",
                      buttons: [
                        {
                          type: "web_url",
                          url: "https://www.google.com/",
                          title: "View Website",
                        },
                      ],
                    },
                  ],
                },
              },

              /* text: `Solo se repetir el mensaje: a`, */
              /* attachment: {
                type: "image",
                payload: {
                  url: "https://assets.puzzlefactory.pl/puzzle/316/243/original.jpg",
                  is_reusable: true,
                },
              }, */
              /* quick_replies: [
                {
                  content_type: "text",
                  title: "Red",
                  payload: "<POSTBACK_PAYLOAD>",
                  image_url:
                    "https://assets.puzzlefactory.pl/puzzle/316/243/original.jpg",
                },
                {
                  content_type: "text",
                  title: "Green",
                  payload: "<POSTBACK_PAYLOAD>",
                  image_url:
                    "https://i.pinimg.com/564x/f6/e1/90/f6e190ba3a2c8646e634908ba2e1443d.jpg",
                },
              ], */
            },
          };

          request(
            {
              uri: "https://graph.facebook.com/v2.6/me/messages",
              qs: { access_token: process.env.APP_TOKEN },
              method: "POST",
              json: messageResponseData,
            },
            function (error, response, data) {
              if (error) {
                console.log("No fue posible enviar el mensaje");
              } else {
                console.log("Mensaje enviado");

                console.log(error);
              }
            }
          );
        }
      });
    });
  }
  res.sendStatus(200);
});

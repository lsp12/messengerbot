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
                  type: "vertical",
                  tag: "generic",
                  elements: [
                    {
                      type: "vertical",
                      elements: [
                        {
                          type: "image",
                          url: "https://i.pinimg.com/736x/a0/67/5e/a0675e5161d7ae5be2550987f397a641--flower-shops-paper-flowers.jpg",
                          tooltip: "Flowers",
                        },
                        {
                          type: "text",
                          tag: "title",
                          text: "Birthday Bouquet",
                          tooltip: "Title",
                        },
                        {
                          type: "text",
                          tag: "subtitle",
                          text: "Wild flowers",
                          tooltip: "subtitle",
                        },
                        {
                          type: "button",
                          tooltip: "publish text example",
                          title: "publish text example",
                          click: {
                            actions: [
                              {
                                type: "publishText",
                                text: "published text button tap",
                              },
                            ],
                          },
                        },
                        {
                          type: "button",
                          tooltip: "URL button example",
                          title: "URL button example",
                          click: {
                            actions: [
                              {
                                type: "link",
                                name: "URL button tap",
                                uri: "https://www.pinterest.com/lyndawhite/beautiful-flowers/",
                              },
                            ],
                          },
                        },
                        {
                          type: "button",
                          title: "Navigate",
                          click: {
                            actions: [
                              {
                                type: "navigate",
                                lo: 40.7562,
                                la: -73.99861,
                              },
                            ],
                          },
                        },
                      ],
                    },
                  ],
                },
              },
              /* text: `Solo se repetir el mensaje: ${messageText}`, */
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
              }
            }
          );
        }
      });
    });
  }
  res.sendStatus(200);
});

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
                  template_type: "customer_feedback",
                  title: "Rate your experience with Original Coast Clothing.", // Business needs to define.
                  subtitle:
                    "Let Original Coast Clothing know how they are doing by answering two questions", // Business needs to define.
                  button_title: "Rate Experience", // Business needs to define.
                  feedback_screens: [
                    {
                      questions: [
                        {
                          id: "hauydmns8", // Unique id for question that business sets
                          type: "csat",
                          title:
                            "How would you rate your experience with Original Coast Clothing?", // Optional. If business does not define, we show standard text. Standard text based on question type ("csat", "nps", "ces" >>> "text")
                          score_label: "neg_pos", // Optional
                          score_option: "five_stars", // Optional
                          // Optional. Inherits the title and id from the previous question on the same page.  Only free-from input is allowed. No other title will show.
                          follow_up: {
                            type: "free_form",
                            placeholder: "Give additional feedback", // Optional
                          },
                        },
                      ],
                    },
                  ],
                  business_privacy: {
                    url: "https://www.example.com/",
                  },
                  expires_in_days: 3, // Optional, default 1 day, business defines 1-7 days
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
              }
            }
          );
        }
      });
    });
  }
  res.sendStatus(200);
});

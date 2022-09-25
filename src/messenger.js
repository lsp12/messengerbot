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
                  template_type: "receipt",
                  recipient_name: "Stephane Crozatier",
                  order_number: "12345678902",
                  currency: "USD",
                  payment_method: "Visa 2345",
                  order_url:
                    "http://petersapparel.parseapp.com/order?order_id=123456",
                  timestamp: "1428444852",
                  address: {
                    street_1: "1 Hacker Way",
                    street_2: "",
                    city: "Menlo Park",
                    postal_code: "94025",
                    state: "CA",
                    country: "US",
                  },
                  summary: {
                    subtotal: 75.0,
                    shipping_cost: 4.95,
                    total_tax: 6.19,
                    total_cost: 56.14,
                  },
                  adjustments: [
                    {
                      name: "New Customer Discount",
                      amount: 20,
                    },
                    {
                      name: "$10 Off Coupon",
                      amount: 10,
                    },
                  ],
                  elements: [
                    {
                      title: "Classic White T-Shirt",
                      subtitle: "100% Soft and Luxurious Cotton",
                      quantity: 2,
                      price: 50,
                      currency: "USD",
                      image_url:
                        "http://petersapparel.parseapp.com/img/whiteshirt.png",
                    },
                    {
                      title: "Classic Gray T-Shirt",
                      subtitle: "100% Soft and Luxurious Cotton",
                      quantity: 1,
                      price: 25,
                      currency: "USD",
                      image_url:
                        "http://petersapparel.parseapp.com/img/grayshirt.png",
                    },
                  ],
                },
              },
              /* attachment: {
                type: "template",
                payload: {
                  template_type: "generic",
                  elements: [
                    {
                      title: "Welcome!",
                      image_url:
                        "https://scontent.fgye1-2.fna.fbcdn.net/v/t39.30808-6/308928362_620241309750206_6506868414479100338_n.jpg?stp=dst-jpg_p180x540&_nc_cat=105&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=UVa9_r-2CJoAX-9YlQb&_nc_ht=scontent.fgye1-2.fna&oh=00_AT9mnY0TUq_NqVcsHcx2Vs38I0R2wzo0olRqMdlR0VPWFg&oe=6335BFA7",
                      subtitle: "We have the right hat for everyone.",
                      default_action: {
                        type: "web_url",
                        url: "https://www.facebook.com/photo/?fbid=620241313083539&set=a.356785789429094",
                        webview_height_ratio: "tall",
                      },
                      buttons: [
                        {
                          type: "web_url",
                          url: "https://www.facebook.com/photo/?fbid=620241313083539&set=a.356785789429094",
                          title: "View Website",
                        },
                        {
                          type: "postback",
                          title: "Start Chatting",
                          payload: "DEVELOPER_DEFINED_PAYLOAD",
                        },
                      ],
                    },
                    {
                      title: "Welcome!",
                      image_url:
                        "https://i.blogs.es/30d986/cyberpunk-edgerunners/1366_2000.jpeg",
                      subtitle: "We have the right hat for everyone.",
                      default_action: {
                        type: "web_url",
                        url: "https://extrajaen.com/universidad/un-bot-ayudara-a-adolescentes-a-hablar-de-sus-emociones",
                        webview_height_ratio: "tall",
                      },
                      buttons: [
                        {
                          type: "web_url",
                          url: "https://extrajaen.com/universidad/un-bot-ayudara-a-adolescentes-a-hablar-de-sus-emociones",
                          title: "View Website",
                        },
                        {
                          type: "postback",
                          title: "Start Chatting",
                          payload: "DEVELOPER_DEFINED_PAYLOAD",
                        },
                      ],
                    },
                  ],
                },
              }, */
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
              qs: {
                access_token: process.env.APP_TOKEN,
              },
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

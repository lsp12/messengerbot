import express from "express";
import bodyParser from "body-parser";
import request from "request";

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.listen(process.env.PORT || 3210, function () {
  console.log("Server Listen in localhost:3210");
});

app.get("/", function (req, res) {
  res.send("Desde el pc");
});

app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === "hello_token") {
    res.send(req.query["hub.challenge"]);
  } else {
    res.send("Prueba");
  }
});

app.post("/webhook", function (req, res) {
  try {
    const data = req.body;
    if (data.object === "page") {
      console.log(data);
      data.entry.forEach((pageEntry) => {
        pageEntry.messaging.forEach((messagingEvent) => {
          if (messagingEvent.message) {
            console.log(messagingEvent);
            const senderId = messagingEvent.sender.id;
            const messageText = messagingEvent.message.text;
            const messageResponseData = {
              recipient: {
                id: senderId,
              },
              message: {},
            };
            if (messagingEvent.message.attachments) {
              messagingEvent.message.attachments.map((att) => {
                console.log("Este es ---", att);
                messageResponseData.message = {
                  attachment: {
                    type: "template",
                    payload: {
                      template_type: "media",
                      elements: [
                        {
                          media_type: "image",
                          url: att.url,
                        },
                      ],
                    },
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
                res.send(200);
              });
            }

            console.log(messageText.toLowerCase());
            switch (messageText.toLowerCase()) {
              case "texto":
                messageResponseData.message = {
                  text: "Hola este es un texto",
                };
                console.log("texto");
                break;
              case "botones":
                console.log("botones");
                messageResponseData.message = {
                  attachment: {
                    type: "template",
                    payload: {
                      template_type: "button",
                      text: "What do you want to do next?",
                      buttons: [
                        {
                          type: "web_url",
                          url: "https://www.messenger.com",
                          title: "Visit Messenger",
                        },
                      ],
                    },
                  },
                };
                break;
              case "imagenes":
                console.log("imagenes");
                messageResponseData.message = {
                  attachment: {
                    type: "image",
                    payload: {
                      url: "https://assets.puzzlefactory.pl/puzzle/316/243/original.jpg",
                      is_reusable: true,
                    },
                  },
                };
                break;

              case "checkout":
                console.log("Checkout");
                messageResponseData.message = {
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
                            "https://scontent.fgye1-2.fna.fbcdn.net/v/t39.30808-6/308928362_620241309750206_6506868414479100338_n.jpg?stp=dst-jpg_p180x540&_nc_cat=105&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=UVa9_r-2CJoAX-9YlQb&_nc_ht=scontent.fgye1-2.fna&oh=00_AT9mnY0TUq_NqVcsHcx2Vs38I0R2wzo0olRqMdlR0VPWFg&oe=6335BFA7",
                        },
                        {
                          title: "Classic Gray T-Shirt",
                          subtitle: "100% Soft and Luxurious Cotton",
                          quantity: 1,
                          price: 25,
                          currency: "USD",
                          image_url:
                            "https://scontent.fgye1-2.fna.fbcdn.net/v/t39.30808-6/308928362_620241309750206_6506868414479100338_n.jpg?stp=dst-jpg_p180x540&_nc_cat=105&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=UVa9_r-2CJoAX-9YlQb&_nc_ht=scontent.fgye1-2.fna&oh=00_AT9mnY0TUq_NqVcsHcx2Vs38I0R2wzo0olRqMdlR0VPWFg&oe=6335BFA7",
                        },
                      ],
                    },
                  },
                };
                break;

              case "empezar":
                console.log("empezar");
                messageResponseData.message = {
                  text: "Hola soy un bot",
                  quick_replies: [
                    {
                      content_type: "text",
                      title: "imagenes",
                      payload: "<POSTBACK_PAYLOAD>",
                      image_url:
                        "https://assets.puzzlefactory.pl/puzzle/316/243/original.jpg",
                    },
                    {
                      content_type: "text",
                      title: "carrusel",
                      payload: "<POSTBACK_PAYLOAD>",
                      image_url:
                        "https://i.pinimg.com/564x/f6/e1/90/f6e190ba3a2c8646e634908ba2e1443d.jpg",
                    },
                    {
                      content_type: "text",
                      title: "texto",
                      payload: "<POSTBACK_PAYLOAD>",
                      image_url:
                        "https://i.pinimg.com/564x/f6/e1/90/f6e190ba3a2c8646e634908ba2e1443d.jpg",
                    },
                    {
                      content_type: "text",
                      title: "botones",
                      payload: "<POSTBACK_PAYLOAD>",
                      image_url:
                        "https://i.pinimg.com/564x/f6/e1/90/f6e190ba3a2c8646e634908ba2e1443d.jpg",
                    },
                  ],
                };
                break;

              case "carrusel":
                console.log("carrusel");
                messageResponseData.message = {
                  attachment: {
                    type: "template",
                    payload: {
                      template_type: "generic",
                      elements: [
                        {
                          title: "Welcome!",
                          image_url:
                            "https://assets.puzzlefactory.pl/puzzle/316/243/original.jpg",
                          subtitle: "We have the right hat for everyone.",
                          default_action: {
                            type: "web_url",
                            url: "https://petersfancybrownhats.com/view?item=103",
                            messenger_extensions: false,
                            webview_height_ratio: "tall",
                            fallback_url: "https://petersfancybrownhats.com/",
                          },
                          buttons: [
                            {
                              type: "web_url",
                              url: "https://petersfancybrownhats.com/",
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
                  },
                };
                break;

              default:
                messageResponseData.message = {
                  text: "esto es lo que puedo hacer",
                  quick_replies: [
                    {
                      content_type: "text",
                      title: "imagenes",
                      payload: "<POSTBACK_PAYLOAD>",
                      image_url:
                        "https://assets.puzzlefactory.pl/puzzle/316/243/original.jpg",
                    },
                    {
                      content_type: "text",
                      title: "carrusel",
                      payload: "<POSTBACK_PAYLOAD>",
                      image_url:
                        "https://i.pinimg.com/564x/f6/e1/90/f6e190ba3a2c8646e634908ba2e1443d.jpg",
                    },
                    {
                      content_type: "text",
                      title: "texto",
                      payload: "<POSTBACK_PAYLOAD>",
                      image_url:
                        "https://i.pinimg.com/564x/f6/e1/90/f6e190ba3a2c8646e634908ba2e1443d.jpg",
                    },
                    {
                      content_type: "text",
                      title: "botones",
                      payload: "<POSTBACK_PAYLOAD>",
                      image_url:
                        "https://i.pinimg.com/564x/f6/e1/90/f6e190ba3a2c8646e634908ba2e1443d.jpg",
                    },
                    {
                      content_type: "text",
                      title: "checkout",
                      payload: "<POSTBACK_PAYLOAD>",
                      image_url:
                        "https://i.pinimg.com/564x/f6/e1/90/f6e190ba3a2c8646e634908ba2e1443d.jpg",
                    },
                  ],
                };
                break;
            }

            request(
              {
                uri: "https://graph.facebook.com/v15.0/me/messages",
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
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
  }
});

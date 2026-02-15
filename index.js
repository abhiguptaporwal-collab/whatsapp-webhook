const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

// 🔐 Apna Gupshup API Key
const API_KEY = "zjsyuafmiumjxibdxplvtiwljkomijss";

// 📲 Apna Gupshup WhatsApp Number (exact jo dashboard me hai)
const SOURCE_NUMBER = "919243166429";

app.get("/", (req, res) => {
  res.send("Server running");
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    console.log("Incoming:", JSON.stringify(body, null, 2));

    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {
      const messageData = body.entry[0].changes[0].value.messages[0];

      const userMessage = messageData.text?.body || "";
      const userNumber = messageData.from;

      console.log("User Message:", userMessage);
      console.log("User Number:", userNumber);

      if (userMessage.toLowerCase() === "hi") {
        await axios({
          method: "post",
          url: "https://api.gupshup.io/sm/api/v1/msg",
          headers: {
            apikey: API_KEY,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: new URLSearchParams({
            channel: "whatsapp",
            source: SOURCE_NUMBER,
            destination: userNumber,
            message: JSON.stringify({
              type: "template",
              template: {
                name: "guptatechhub_main",
                language: {
                  code: "en"
                }
              }
            })
          }).toString()
        });

        console.log("Template Sent Successfully");
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});

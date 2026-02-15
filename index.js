const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

// 🔐 Apna Gupshup API Key yaha daalo
const API_KEY = "zjsyuafmiumjxibdxplvtiwljkomijss";

// 📲 Tumhara Gupshup WhatsApp number
const SOURCE_NUMBER = "919243166429";

// Health check
app.get("/", (req, res) => {
  res.status(200).send("Server running");
});

// Webhook route
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    console.log("Incoming Data:", JSON.stringify(body, null, 2));

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
        await axios.post(
          "https://api.gupshup.io/wa/api/v1/msg",
          {
            channel: "whatsapp",
            source: SOURCE_NUMBER,
            destination: userNumber,
            message: {
              type: "template",
              template: {
                name: "guptatechhub_main",
                language: { code: "en" }
              }
            }
          },
          {
            headers: {
              apikey: API_KEY,
              "Content-Type": "application/json"
            }
          }
        );

        console.log("Template Sent Successfully");
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});

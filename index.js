const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

// 🔐 Yaha apni NEW App API Key paste karo
const API_KEY = "sk_42bfca95e8204b75a686d3f17b7daf59";

// 📲 Dashboard me jo display_phone_number hai wahi daalo
const SOURCE_NUMBER = "919243166429";

// Health check
app.get("/", (req, res) => {
  res.status(200).send("Server running");
});

// Webhook
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

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

      // Agar user "hi" bheje
      if (userMessage.trim().toLowerCase() === "hi") {

        await axios.post(
          "https://api.gupshup.io/wa/api/v1/template/msg",
          {
            source: SOURCE_NUMBER,
            destination: userNumber,
            template: {
              name: "guptatechhub_main",
              language: "en"
            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              apikey: API_KEY
            }
          }
        );

        console.log("✅ Template Sent Successfully");
      }
    }

    res.sendStatus(200);

  } catch (error) {
    console.log("❌ ERROR:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});

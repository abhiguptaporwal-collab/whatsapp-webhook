const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

// App Level API Key
const API_KEY = "sk_42bfca95e8204b75a686d3f17b7daf59";

// IMPORTANT: Phone Number ID (not mobile number)
const PHONE_NUMBER_ID = "941331062402495";

app.get("/", (req, res) => {
  res.send("Server running");
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {
      const msg = body.entry[0].changes[0].value.messages[0];
      const userMessage = msg.text?.body || "";
      const userNumber = msg.from;

      console.log("User Message:", userMessage);
      console.log("User Number:", userNumber);

      if (userMessage.trim().toLowerCase() === "hi") {

        await axios.post(
          `https://api.gupshup.io/wa/api/v1/messages/${PHONE_NUMBER_ID}`,
          {
            messaging_product: "whatsapp",
            to: userNumber,
            type: "template",
            template: {
              name: "guptatechhub_main",
              language: { code: "en" }
            }
          },
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json"
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

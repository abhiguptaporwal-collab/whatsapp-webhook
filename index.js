const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 10000;

const API_KEY = "zjsyuafmiumjxibdxplvtiwljkomijss";
const SOURCE_NUMBER = "919243166429"; // display_phone_number

app.get("/", (req, res) => {
  res.send("Server running and waiting for WhatsApp!");
});

app.get("/webhook", (req, res) => {
  res.status(200).send("ok");
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    console.log("Raw Payload:", JSON.stringify(body));

    const message =
      body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const userMessage = message.text?.body || "";
    const userNumber = message.from;

    console.log("User Message:", userMessage);
    console.log("User Number:", userNumber);

    if (userMessage.trim().toLowerCase() === "hi") {

      const response = await axios.post(
        "https://api.gupshup.io/sm/api/v1/msg",
        new URLSearchParams({
          channel: "whatsapp",
          source: SOURCE_NUMBER,
          destination: userNumber,
          "src.name": "nayasetuguptatech",
          message: JSON.stringify({
            type: "text",
            text: "Hello 👋 Welcome to NayaSetu Gupta Tech!"
          })
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            apikey: API_KEY
          }
        }
      );

      console.log("✅ Message Sent:", response.data);
    }

    res.sendStatus(200);

  } catch (error) {
    console.error("❌ ERROR:", error.response?.data || error.message);
    res.sendStatus(200);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});

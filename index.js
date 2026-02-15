const express = require("express");
const axios = require("axios");

const app = express();
// Gupshup kabhi-kabhi URL encoded data bhi bhej sakta hai, isliye dono use karein
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 10000;

const API_KEY = "sk_42bfca95e8204b75a686d3f17b7daf59";
const SOURCE_NUMBER = "919243166429";

app.get("/", (req, res) => {
  res.send("Server running and waiting for Gupshup!");
});

// Gupshup Webhook Verification (GET request)
app.get("/webhook", (req, res) => {
  res.status(200).send("ok");
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    console.log("Raw Payload:", JSON.stringify(body)); // Debugging ke liye

    // Gupshup ka standard payload structure check
    if (body && body.type === "message") {
      const userMessage = body.payload.payload.text || "";
      const userNumber = body.payload.sender.phone;

      console.log("User Message:", userMessage);
      console.log("User Number:", userNumber);

      // Reply logic
      if (userMessage.trim().toLowerCase() === "hi") {
        const response = await axios.post(
          "https://api.gupshup.io/sm/api/v1/msg",
          new URLSearchParams({
            channel: "whatsapp",
            source: SOURCE_NUMBER,
            destination: userNumber,
            "src.name": "nayasetuguptatech", // Aapka App Name dashboard se
            message: JSON.stringify({
              type: "template",
              template: {
                name: "guptatechhub_main",
                language: { code: "en" }
              }
            })
          }).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "apikey": API_KEY
            }
          }
        );

        console.log("✅ Template Sent Successfully", response.data);
      }
    }

    res.sendStatus(200);

  } catch (error) {
    console.error("❌ ERROR:", error.response?.data || error.message);
    res.sendStatus(200); // Gupshup ko hamesha 200 dein taaki wo retry na kare
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});

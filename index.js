const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WhatsApp Webhook Running 🚀");
});

app.post("/webhook", async (req, res) => {
  console.log(req.body);

  res.status(200).send("Received");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

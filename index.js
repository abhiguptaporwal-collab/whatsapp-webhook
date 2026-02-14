const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WhatsApp Webhook Running 🚀");
});

app.post("/webhook", (req, res) => {
  console.log(req.body);
  res.status(200).send("OK");
});

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started on port " + PORT);
});

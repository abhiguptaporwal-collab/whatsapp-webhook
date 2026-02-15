const express = require("express");
const app = express();

app.use(express.json());

// Healthcheck route
app.get("/", (req, res) => {
  res.status(200).send("Server running");
});

// Webhook route
app.post("/webhook", (req, res) => {
  console.log(req.body);
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});

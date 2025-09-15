const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// --- Session ---
app.use(session({
  secret: "my_secret_key_123",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // שעה
}));

// --- Body Parser ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Static files ---
app.use(express.static(path.join(__dirname, "public")));

// --- דף המשחק מוגן ---
app.get("/cards.html", (req, res) => {
  if(req.session.paid){
    res.sendFile(path.join(__dirname, "public/cards.html"));
  } else {
    res.redirect("/index.html");
  }
});

// --- דף תודה ---
app.get("/thanks.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public/thanks.html"));
});

// --- קבלת הודעה מ-PayPal (Webhook/IPN / Sandbox) ---
app.post("/paypal-success", (req, res) => {
  const { userId } = req.body;
  req.session.paid = true;
  console.log("Payment approved for user:", userId);
  res.json({ success: true });
});

// --- התחלת שרת ---
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

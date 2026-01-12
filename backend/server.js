require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const User = require("./models/User");
const Order = require("./models/Order");
const auth = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

// LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (!user) return res.json({ error: "Invalid login" });

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET
  );
  res.json({ token, role: user.role });
});

// PLACE ORDER
app.post("/order", auth, async (req, res) => {
  await Order.create({ ...req.body, user: req.user.email });
  res.json("Order placed");
});

// ORDER HISTORY
app.get("/orders", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.email });
  res.json(orders);
});

// ADMIN – ALL ORDERS
app.get("/admin/orders", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);
  res.json(await Order.find());
});

app.listen(3000, () => console.log("Server running"));

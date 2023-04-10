const express = require("express");
const app = express();
const env = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

connectDB();

app.use(cors());

app.use(express.json());

app.use("/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5001;

mongoose.connection.once("open", () => {
  console.log("connected to db");
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

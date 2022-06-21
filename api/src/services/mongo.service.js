const mongoose = require("mongoose");
const dotenv = require("dotenv");

const TEST_DATABASE = "testing";

dotenv.config();

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});
mongoose.connection.on("disconnected", (err) => {
  console.log("MongoDB disconnected");
});

async function connect(database = "") {
  const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.4smxb.mongodb.net/${database}?retryWrites=true&w=majority`;
  await mongoose.connect(MONGO_URL);
}

async function disconnect() {
  await mongoose.disconnect();
}

module.exports = {
  TEST_DATABASE,
  connect,
  disconnect,
};

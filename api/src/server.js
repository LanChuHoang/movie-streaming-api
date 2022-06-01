const http = require("http");
const app = require("./app");
const mongoService = require("./services/mongo.service");

const server = http.createServer(app);
const PORT = 8000;

mongoService.connect();

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

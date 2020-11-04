const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let arrayOfClients = [];

// const mainClientId;


io.on("connection", (socket) => {
  console.log("New client connected");
  let newUser = {}
  
  socket.on("customObj", (obj) => {    
    arrayOfClients.push(obj)
    newUser = obj
    console.log(arrayOfClients)
    io.sockets.emit("hello", `Hello there ${obj.type} device`)
    console.log("Welcome message emited")
  })



  socket.on("disconect", (data) => {
    console.log("DISCONNECTED", data)
  })

  socket.on("disconnect", () => {

    console.log("Client disconnected");
  });
});


const getApiAndEmit = socket => {
  // const response = new Date();
  // // Emitting a new message. Will be consumed by the client
  // socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
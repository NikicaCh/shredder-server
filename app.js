const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);


// const mainClientId;
const middleware = require('socketio-wildcard')();
io.use(middleware);

io.on("connection", (socket) => {
  console.log("New client connected");

  let newUser = {}
  socket.on('join', (room) => {
    socket.join(room);
    console.log(io.sockets.adapter.rooms)

    });
  socket.on('*', (packet) =>{
    let room = packet.data[1].passCode;
    let {msg} = packet.data[1];
    let {type} = packet.data[1]
    if(msg === "Hello, I am Nikica Who are you?") {
      io.sockets.to(room).emit("1", msg)
    }
    if(type === "answer") {
      io.sockets.to(room).emit("11", msg)
    }
    console.log("EMITED", packet)
  });
    
  socket.on("customObj", (obj) => {   
    io.sockets.emit("hello", `Hello there ${obj.type} device`)
  })

  socket.on("ask", (obj) => {
    console.log(obj)
    io.sockets.to(obj.room).emit("question", obj)
  })

  socket.on("mobile", (room) => {
    io.sockets.to(room).emit("mobile-connected", room)
  })



  socket.on("disconect", (data) => {
    console.log("DISCONNECTED", data)
  })

  socket.on("disconnect", () => {

    console.log("Client disconnected");
    console.log(io.sockets.adapter.rooms)

  });
});


const getApiAndEmit = socket => {
  // const response = new Date();
  // // Emitting a new message. Will be consumed by the client
  // socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
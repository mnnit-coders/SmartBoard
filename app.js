const express=require('express');
const socket=require('socket.io')
const app=express();
app.use(express.static('./public'))
app.get('/',(req,res)=>{
    res.sendFile('./public/index.html')
})

let server=app.listen(3000,()=>{
    console.log('listening at 3000');
})

let io=socket(server);
io.on("connection",(socket)=>{
    console.log('connected');
    socket.on("beginpath", (data) => {
        // data -> data from frontend
        // Now transfer data to all connected computers
        io.sockets.emit("beginpath", data);
    })
    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    })
    socket.on("redoUndo", (data) => {
        io.sockets.emit("redoUndo", data);
    })
})
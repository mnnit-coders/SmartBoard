let canvas=document.querySelector('canvas');
let pencilcolorcont=document.querySelectorAll('.pencil-color');
let pencilwidthcont=document.querySelector('.pencil-width');
let download=document.querySelector('.download');
let eraserwidthcont=document.querySelector('.eraser-width');
let pencolor="black";
let erasercolor="white";
let redo=document.querySelector('.redo')
let undo=document.querySelector('.undo')
let penwidth=pencilwidthcont.value;
let eraserwidth=eraserwidthcont.value;
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let mousedown=false;
let undoredotracker=[];
let track=0;
let tool=canvas.getContext('2d');
tool.strokeStyle=pencolor;
tool.lineWidth=penwidth;
canvas.addEventListener('mousedown',(e)=>{
    mousedown=true;
//   beginPath({
//     x:e.clientX,
//     y:e.clientY
//   })
let data={
    x:e.clientX,
    y:e.clientY
}
socket.emit("beginpath",data)

})
canvas.addEventListener('mousemove',(e)=>{
    if(mousedown){
        let data={
            x:e.clientX,
            y:e.clientY,
            color:eraserflag?erasercolor:pencolor,
            width:eraserflag?eraserwidth:penwidth
        }
        socket.emit("drawStroke",data)
        // drawstroke({
        //     x:e.clientX,
        //     y:e.clientY,
        //     color:eraserflag?erasercolor:pencolor,
        //     width:eraserflag?eraserwidth:penwidth
        // })
    }
})
canvas.addEventListener('mouseup',(e)=>{
    mousedown=false;
    let url=canvas.toDataURL();
    undoredotracker.push(url);
    track=undoredotracker.length-1;

})

undo.addEventListener('click',(e)=>{
if(track>0){
    track--;
}
let data={
    trackvalue:track,
    undoredotracker
}
// undoredocanvas(trackobj)
socket.emit("redoUndo",data);

})
redo.addEventListener('click',(e)=>{
if(track<undoredotracker.length-1) track++;
let data={
    trackvalue:track,
    undoredotracker
}
// undoredocanvas(trackobj)
socket.emit("redoUndo",data);

})
function undoredocanvas(trackobj){
  track=trackobj.trackvalue;
   undoredotracker=trackobj.undoredotracker;
  let url=undoredotracker[track];
  let img=new Image();  
  img.src=url;
  img.onload=(e)=>{
    tool.drawImage(img,0,0,canvas.width,canvas.height);
  }

}

function beginPath(strokeobj){
    tool.beginPath();
    tool.moveTo(strokeobj.x,strokeobj.y);
}
function drawstroke(strokeobj){
    tool.lineTo(strokeobj.x,strokeobj.y);
    tool.stroke();
    tool.strokeStyle=strokeobj.color;
    tool.lineWidth=strokeobj.width;

}

pencilcolorcont.forEach((color)=>{
color.addEventListener('click',(e)=>{
    let colour=color.classList[0];
    pencolor=colour;
    tool.strokeStyle=pencolor;
})
})
pencilwidthcont.addEventListener("change",()=>{
    penwidth=pencilwidthcont.value;
    tool.lineWidth=penwidth;
})
eraserwidthcont.addEventListener("change",()=>{
   
    eraserwidth=eraserwidthcont.value;
    tool.lineWidth=eraserwidth;
})
eraser.addEventListener('click',()=>{
    if(eraserflag){
    tool.strokeStyle=erasercolor;
    tool.lineWidth=eraserwidth;
    }
    else{
        tool.strokeStyle=pencolor;
        tool.lineWidth=penwidth;
    }
})

download.addEventListener('click',(e)=>{
let url=canvas.toDataURL();
let a=document.createElement('a');
a.href=url;
a.download="board.jpg";
a.click();
})

socket.on("beginpath",(data)=>{
beginPath(data)

})
socket.on("drawStroke",(data)=>{
    drawstroke(data)
})

socket.on("redoUndo",(data)=>{
undoredocanvas(data)
})
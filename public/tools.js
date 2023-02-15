let toolscont=document.querySelector('.tools-cont');
let penciltoolcont=document.querySelector('.pencil-tool-cont');
let erasertoolcont=document.querySelector('.eraser-tool-cont');
let optionscont=document.querySelector('.options-cont');
let scaletools=document.querySelector('scale-tools');
let pencil=document.querySelector('.pencil');
let eraser=document.querySelector('.eraser');
let pencilflag=false;
let eraserflag=false;
let optionflag=true;
let sticky=document.querySelector('.sticky');
optionscont.addEventListener('click',(e)=>{
    
     optionflag=!optionflag;
     if(optionflag){
        opentools();
     }
     else{
closetools();
     }
})
function opentools(){
    let iconelement=optionscont.children[0];
    iconelement.classList.remove("fa-times");
    iconelement.classList.add("fa-bars");
    toolscont.style.display="flex";
}
function closetools(){
    let iconelement=optionscont.children[0];
    iconelement.classList.remove("fa-bars");
    iconelement.classList.add("fa-times");
    toolscont.style.display="none";
    penciltoolcont.style.display="none";
    erasertoolcont.style.display="none";
}
pencil.addEventListener('click',(e)=>{
pencilflag=!pencilflag;
if(pencilflag){
    penciltoolcont.style.display="block";
}
else{
    penciltoolcont.style.display="none";
}
})
eraser.addEventListener('click',(e)=>{
eraserflag=!eraserflag;
if(eraserflag){
    erasertoolcont.style.display="flex";
}
else{
    erasertoolcont.style.display="none";
}
})
sticky.addEventListener('click',(e)=>{

    let stickyTemplateHTML=`
    <div class="header-cont">
    <div class="minimize"></div>
    <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>
    `
    createSticky(stickyTemplateHTML);
})

function createSticky(stickyTemplateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteactions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function (event) {
        dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
        return false;
    };
}
function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    moveAt(event.pageX, event.pageY);
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    document.addEventListener('mousemove', onMouseMove);
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}


function noteactions(minimize,remove,stickycont){
remove.addEventListener('click',()=>{
    stickycont.remove()
})
minimize.addEventListener('click',()=>{
    let notecont=stickycont.querySelector('.note-cont')
    let display=getComputedStyle(notecont).getPropertyValue('display')
    if(display==='none'){
        notecont.style.display="block";
    }
    else{
        notecont.style.display="none";
    }
})

}

let upload=document.querySelector('.upload')
upload.addEventListener('click',(e)=>{

    let input=document.createElement('input')
    input.setAttribute("type",'file');
    input.click();
    input.addEventListener("change",(e)=>{
        let files=input.files[0];
        let url=URL.createObjectURL(files);
        let stickyTemplateHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src="${url}"/>
        </div>
        `;
        createSticky(stickyTemplateHTML);
    })
    
})
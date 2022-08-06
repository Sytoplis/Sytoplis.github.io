//Created on 4.6.2022

/*
Times Table Sources:
https://www.youtube.com/watch?v=qhbuKbxJsk8
https://www.youtube.com/watch?v=6ZrO90AI0c8
*/


var canvas, ctx, width, height, size;

/*
const colors = [[234, 14, 17, 0], [54, 188, 74, 0.6], [157, 234, 14, 0.9], [14, 142, 234, 1]];//r, g, b , position
function lerp(a, b, t) {return (1-t)*a + t*b;}
function lerpClr(c1, c2, t){ return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];}
function getClr(t) {
    t = Math.min(Math.max(t, 0), 0.9999);//clamp t between 0 and 1
    for(let i = 1; i < colors.length; i++){
        if(colors[i][3] > t){
            let dt = colors[i][3] - colors[i-1][3];
            let clrT = (t-colors[i-1][3])*dt;
            return "rgb(" + lerpClr(colors[i], colors[i-1], clrT) + ")";
        }          
    }
    return "rgb(255, 255, 255)"
}*/
function clamp(min, max, v){ return Math.min(Math.max(v, min), max);}
function getClr(t){
    h = (1-clamp(0, 1, t))*360;
    return "HSL("+h+",100%,50%)";
}

var mulInput, modInput, mulSpeed, modSpeed;
var drawCircle, colored, animMul, animMod;

function onload(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    mulInput = document.getElementById("mul");
    modInput = document.getElementById("mod");

    //mulInput.onchange = function() {drawTimesTable();};
    //modInput.onchange = function() {drawTimesTable();};

    document.getElementById("color").onchange = function(){colored = document.getElementById("color").checked;    /*drawTimesTable();*/};
    colored = document.getElementById("color").checked;
    document.getElementById("circle").onchange = function(){drawCircle = document.getElementById("circle").checked;   /*drawTimesTable();*/};
    drawCircle = document.getElementById("circle").checked;

    mulSpeed = document.getElementById("mulSpeed")
    modSpeed = document.getElementById("modSpeed")
    document.getElementById("animMul").onchange = function(){animMul = document.getElementById("animMul").checked;}
    animMul = document.getElementById("animMul").checked;
    document.getElementById("animMod").onchange = function(){animMod = document.getElementById("animMod").checked;}
    animMod = document.getElementById("animMod").checked;

    onresize();
    animateValues();
}

function onresize(){
    //width = screen.width;
    //height = screen.height;
    //width = canvas.offsetWidth;
    //height = canvas.offsetHeight;
    //width = canvas.style.width;
    //height = canvas.style.height;
    let browserZoomLevel = window.devicePixelRatio;
    width = document.documentElement.clientWidth * browserZoomLevel;
    height = document.documentElement.clientHeight * browserZoomLevel;
    document.documentElement.scrollWidth = document.documentElement.clientWidth;
    document.documentElement.scrollHeight = document.documentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;
    document.body.style.width = width;
    document.body.style.height = height;
    size = Math.min(width, height);

    //drawTimesTable();
}

async function animateValues(){
    let step = 10;//10 miliseconds
    let secStep = step / 1000.0;//in seconds
    while(true){
        onresize();//TEST

        if(animMul) mulInput.value = Number(mulInput.value) + secStep * Number(mulSpeed.value);
        if(animMod) modInput.value = Number(modInput.value) + secStep * Number(modSpeed.value);
        drawTimesTable();
        await new Promise(resolve => setTimeout(resolve, step));
    }
}

function drawTimesTable(){
    let mul = mulInput.value;
    let mod = clamp(0, modInput.max, modInput.value);

    let rad = size*0.5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    if(drawCircle) ctx.ellipse(width*0.5, height*0.5, rad, rad, 0, 0, 2*Math.PI);
    ctx.stroke();

    drawIntegers();
    
    let lineW = 12.0 * Math.pow(mod, -0.5);
    for(let i = 0; i < mod; i++){
        drawNumberLine(i, (i * mul) % mod, mod, rad, lineW);
    }
}

function drawNumberLine(a, b, count, rad, lineW){
    let angleA = a / count * 2*Math.PI;
    let xa = Math.cos(angleA);
    let ya = Math.sin(angleA);

    let angleB = b / count * 2*Math.PI;
    let xb = Math.cos(angleB);
    let yb = Math.sin(angleB);

    ctx.beginPath();
    //let length = 2*Math.abs(Math.sin((a-b)/2/count));//2*|sin((a-b)/(2*count))|
    let length = Math.sqrt(0.25*(xa-xb)*(xa-xb) + 0.25*(ya-yb)*(ya-yb));
    if(colored) ctx.strokeStyle = getClr(length);
    ctx.lineWidth = lineW;

    xa = xa * rad + width*0.5;
    ya = ya * rad + height*0.5;
    xb = xb * rad + width*0.5;
    yb = yb * rad + height*0.5;

    ctx.moveTo(xa, ya);
    ctx.lineTo(xb, yb);
    ctx.stroke();
}

function drawIntegers(){
    //TODO: draw points on integer positions and label them
}
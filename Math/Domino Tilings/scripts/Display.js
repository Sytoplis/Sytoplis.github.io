//source: https://www.youtube.com/watch?v=Yy7Q8IWNfHM

//code created on 05.05.2022 by Yannis Paul

import AztecDiamond from "./AztecDiamond.js";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var size = screen.height - 200;
canvas.width = size;
canvas.height = size;

var stepCount = 0;
var stepIndex = 0;
document.getElementById("step").onclick = function(){  
    step();
};

document.getElementById("wholeStep").onclick = function(){
    finishStep();
    wholestep();
};


var repeat = false;
var repeatFunc;
document.getElementById("repeatStep").onclick = function(){
    if(repeat){
        console.log("stop repeat");
        repeat = false;
        clearTimeout(repeatFunc);
    }
    else{
        finishStep();

        console.log("start repeat");
        repeat = true;
        repeatFunc = async() => {
            while(repeat){
                wholestep();
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        };
        repeatFunc();
    }
}


function getStyle(className){ return window.getComputedStyle(document.getElementsByClassName(className)[0]); }//UNSAFE -> DEMANDS OBJECT WITH THAT STYLE
var dark_text = getStyle("dark_text");

var board;
init();


function init(){
    board = new AztecDiamond();

    draw();
}

function addCounter() { document.getElementById("stepCount").innerHTML = stepCount++; }

function finishStep(){
    if(stepIndex == 2)
        return
    for(let i = 0; i < 4; i++){
        step();
        if(stepIndex == 2)
            break;
    }
}

function wholestep(){
    addCounter();

    board.removeConflicting();
    board.moveTiling();
    let holes = board.findHoles();
    board.fillHoles(holes);
    draw();
}

function step(){
    switch(stepIndex){
        case 0:
            board.moveTiling();
            break;
        case 1:
            let holes = board.findHoles();
            board.fillHoles(holes);
            break;
        case 2:
            addCounter();
            board.removeConflicting();
            break;
    }

    draw();
    stepIndex++;
    stepIndex %= 3;
}

function draw(){
    let scale = 50;
    if(scale*2*board.size > size)
        scale = size / (2*board.size);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.draw(ctx, scale, size, canvas.width/2, canvas.height/2);
    //board.drawTxt(ctx, scale, size, canvas.width/2, canvas.height/2);
}
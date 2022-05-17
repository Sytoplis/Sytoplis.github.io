import {playSequence, playChord, stop, setVol} from "./sounds.js";
 
document.getElementById("c4").onclick = function() { PlayKey(48); }
document.getElementById("stop").onclick = function() { stop(); }

var guessNotes = [];
var guessed = [];
const noteLength = 0.4;
document.getElementById("generate").onclick = function() { generateNotes(); playChord(guessNotes, noteLength); }
document.getElementById("playChord").onclick = function() { playChord(guessNotes, noteLength); }
document.getElementById("playSequ").onclick = function() { playSequence(guessNotes, noteLength); }

const rangeMin = document.getElementById("RangeMin");
const rangeMax = document.getElementById("RangeMax");
var startNote = 36;
var endNote = 73;
rangeMin.oninput = function() { startNote = Number(rangeMin.value); }
rangeMax.oninput = function() { endNote = Number(rangeMax.value); }
document.getElementById("reloadKeyb").onclick = function() { deleteKeyboard(); generateKeyboard(); }


const volSlide = document.getElementById("volumeSlide");
volSlide.oninput = function() { setVol(volSlide.value / 100.0 + 0.00001); }



const blackKeyLookup = [0,1,0,1,0,0,1,0,1,0,1,0];
function isBlack(n) { return blackKeyLookup[n%12] == 1;}


var keyboard = [];
var keybDiv = document.getElementById("keyboard");
function generateKeyboard(){
    const width = keybDiv.offsetWidth / ((endNote-startNote) * 7.0/12 + 1);
    const height = Math.min(width * 4, keybDiv.offsetHeight);

    const blWidth = width*0.75;
    const blHeight = height*0.75;

    let posX = 0;
    for(let n = startNote; n < endNote; n++){
        let key = document.createElement("button");
        key.id = n;
        key.onclick = function() { keyPress(Number(key.id)); }

        if(isBlack(n)){
            key.className = "darkKey";
            key.style.width = blWidth + "px";
            key.style.height = blHeight + "px";
            key.style.left = (posX-width*0.4) + "px";
        }else{//if white
            key.className = "whiteKey";
            key.style.width = width + "px";
            key.style.height = height + "px";
            key.style.left = posX + "px";
            posX += width;//only change x if white key
        }

        keybDiv.appendChild(key);
        keyboard.push(key);
    }
}

function resetKeyboard(){
    document.getElementById("done").style.visibility = "hidden";

    for(let k = 0; k < keyboard.length; k++)
        keyboard[k].style.backgroundColor = "";//clear background color -> use color from class
}

function deleteKeyboard(){
    while(keyboard.length > 0){
        let key = keyboard.pop();
        keybDiv.removeChild(key);
    }
}

//------------------------------- Key Input and Output --------------------------------

function keyPress(note){
    if(guessNotes.includes(note)){
        markKey(note, "#36c932");
        if(!guessed.includes(note)){//if note wasnt guessed already -> add it to the "already guessed" list
            guessed.push(note);
            if(guessed.length == guessNotes.length)
                allGuessed();
        }
    }else{
        markKey(note, "#c93232");
    }
}

async function PlayKey(note){
    let key = keyboard[note-startNote];
    let clr = key.style.backgroundColor;

    if(isBlack(note)){
        key.style.backgroundColor = "#646464";
    }else{
        key.style.backgroundColor = "#fffdbf";
    }
    await playChord([note], noteLength);
    key.style.backgroundColor = clr;
}


async function markKey(note, color){
    let key = keyboard[note-startNote];
    key.style.backgroundColor = color;
    await playChord([note], noteLength);
}

//---------------------------------- Main Game Loop ----------------------------------

function rndInt(min, max) { 
    return Math.floor(Math.random()*(max-min) + min); 
}
function generateNotes(){
    resetKeyboard();

    let count = document.getElementById("noteCount").value;
    guessNotes = [];
    guessed = [];
    for(let i = 0; i < count; i++){
        let note = rndInt(startNote, endNote);
        if(guessNotes.includes(note)){//repeat if note is already included
            i--;
            continue;
        }

        guessNotes.push(note);
    }
}

function allGuessed(){
    document.getElementById("done").style.visibility = "visible";
}


generateKeyboard();
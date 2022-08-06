//Created on the 17.05.2022 (and the following days) by Yannis Paul 

//stats
var sumWrong = 0;
var sumSequPlays = 0;
var sumRepeats = 0;

var genCount = 0;

var curWrong = 0;
var curSequPlays = 0;
var curRepeats = 0;
//end stats


var ref = 48;//start with c4

var guessNotes = [];
var guessed = [];
const noteLength = 0.4;

var startNote = 36;
var endNote = 73;

var randRef, rangeMin, rangeMax, keybDiv;
function onload(){
    randRef = document.getElementById("randomizeRef");
    rangeMin = document.getElementById("RangeMin");
    rangeMax = document.getElementById("RangeMax");
    volSlide = document.getElementById("volumeSlide");
    keybDiv = document.getElementById("keyboard");

    document.getElementById("ref").onclick = function() { PlayKey(ref); }
    document.getElementById("stop").onclick = function() { stop(); }

    document.getElementById("generate").onclick = function() { 
        generateNotes(); 
        playChord(guessNotes, noteLength); 
        if(randRef.checked) ref = rndInt(startNote, endNote);
        else                      ref = 48;//reset to c4
    }
    document.getElementById("playChord").onclick = function() { playChord(guessNotes, noteLength); curRepeats++; updateStats(); }
    document.getElementById("playSequ").onclick = function() { playSequence(guessNotes, noteLength); curSequPlays++; updateStats(); }

    rangeMin.oninput = function() { startNote = Number(rangeMin.value); }
    rangeMax.oninput = function() { endNote = Number(rangeMax.value); }
    document.getElementById("reloadKeyb").onclick = function() { deleteKeyboard(); generateKeyboard(); }

    volSlide.oninput = function() { setVol(volSlide.value / 100.0 + 0.00001); }

    
    generateKeyboard();
    generateNotes();
}


const blackKeyLookup = [0,1,0,1,0,0,1,0,1,0,1,0];
function isBlack(n) { return blackKeyLookup[n%12] == 1;}


var keyboard = [];
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
    finishRound();
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
        curWrong++;
        updateStats();
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

function rndInt(min, max) { return Math.floor(Math.random()*(max-min) + min); }
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

//------------------------------- Stats ----------------------------------

function updateStats(){
    document.getElementById("curRepeats").innerHTML = "Repeats: " + curRepeats;
    document.getElementById("curSequ").innerHTML = "Sequencial Plays: " + curSequPlays;
    document.getElementById("curWrong").innerHTML = "Wrong Guesses: " + curWrong;

    if(genCount == 0)
        return;

    document.getElementById("avrgRepeats").innerHTML = "Repeats: " + (sumRepeats / genCount).toFixed(2);
    document.getElementById("avrgSequ").innerHTML = "Sequencial Plays: " + (sumSequPlays / genCount).toFixed(2);
    document.getElementById("avrgWrong").innerHTML = "Wrong Guesses: " + (sumWrong / genCount).toFixed(2);

    document.getElementById("genCount").innerHTML = "Generation Count: " + genCount;
}

function finishRound(){
    sumRepeats += curRepeats;
    sumSequPlays += curSequPlays;
    sumWrong += curWrong;
    genCount++;

    curRepeats = 0;
    curSequPlays = 0;
    curWrong = 0;
    updateStats();
}
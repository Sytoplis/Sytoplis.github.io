//src: https://www.positioniseverything.net/javascript-play-sound

var AudioContext = window.AudioContext || window.webkitAudioContext;

//initialization
var ctx = new AudioContext();
var gain = ctx.createGain();
var oscillators = [];

gain.connect(ctx.destination);
gain.gain.setTargetAtTime(0.5, ctx.currentTime, 0.04);



function setVol(vol){
    setGain(vol);
}


function playSynth(note){
    var o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = noteToFreq(note);//frequency always positive
    o.connect(gain);
    o.start(0);
    oscillators.push(o);
}

async function stopSynth(){
    var lastVol = gain.gain.value;
    await setGain(0);
    
    while(oscillators.length > 0){
        var o = oscillators.pop();//read and remove this element
        o.stop();
        o.disconnect();
    }

    await setGain(lastVol);
}


//a sleep function that sleeps the given delay (in seconds). e.g.: "await sleep(1)" waits one second
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000))

async function setGain(vol){//why are the values 0.04 and 0.2? idk, they just worked best
    gain.gain.setTargetAtTime(vol, ctx.currentTime, 0.04);//why set target at time? idk its the only thing that functioned
    await sleep(0.2);//the actual time is something exponential i guess???
}


//------------------------------------ Use Soundfonts -------------------------------

var instr;
loadInstr('acoustic_grand_piano');//load initial instrument

async function loadInstr(loadInstr){//e.g.: 'acoustic_grand_piano'
    instr = await Soundfont.instrument(ctx, loadInstr);//load the instrument
}

async function playInstr(note){ instr.play(noteName(note), 0); }
async function stopInstr(){ instr.stop(); }


//-------------------------------- Combi Interface -----------------------------------------

async function play(note){
    if(instr == null)
        await playSynth(note);
    else
        await playInstr(note);
}
async function stop(note){
    if(instr == null)
        await stopSynth(note);
    else
        await stopInstr(note);
}


//------------------------ ADVANCED AUDIO PLAYING --------------------------------
const NoteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function noteName(note) { return NoteNames[note%12] + (Math.floor(note/12)).toString(); }

function noteToFreq(note) { return 440 * Math.pow(2, (note - 69) / 12); }//0 -> c0

var playing = false;
async function playSequence(notes, length, delay=0){
    if(playing) return;
    playing = true;

    for(let i = 0; i < notes.length; i++){
        play(notes[i]);
        await sleep(length);
        await stop();
        await sleep(delay);
    }

    playing = false;
}

async function playChord(tones, length){
    if(playing) return;
    playing = true;

    for(let i = 0; i < tones.length; i++)
        play(tones[i]);
    await sleep(length);
    await stop();

    playing = false;
}
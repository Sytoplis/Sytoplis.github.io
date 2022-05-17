//src: https://www.positioniseverything.net/javascript-play-sound

var AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx, gain, oscillators;
var initialized = false;
async function try_init(){
    if(initialized) return;
    initialized = true;

    ctx = new AudioContext();
    gain = ctx.createGain();
    oscillators = [];
    
    gain.connect(ctx.destination);
    await setGain(0.5);
}


export function setVol(vol){
    if(!initialized) return;
    setGain(vol);
}


export async function play(freq){
    await try_init();

    var o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = +freq;//frequency always positive
    o.connect(gain);
    o.start(0);
    oscillators.push(o);
}


export async function stop(){
    if(!initialized) return;

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
export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000))

async function setGain(vol){//why are the values 0.04 and 0.2? idk, they just worked best
    gain.gain.setTargetAtTime(vol, ctx.currentTime, 0.04);//why set target at time? idk its the only thing that functioned
    await sleep(0.2);//the actual time is something exponential i guess???
}


//------------------------ ADVANCED AUDIO PLAYING --------------------------------

const halfT = Math.pow(2, 1.0/12);
const c0 = 27.5 * Math.pow(halfT, -9);//take A0 = 440 Hz / 16   and move 9 halfsteps down to c0
export function noteToFreq(note) { return c0 * Math.pow(halfT, note); }

var playing = false;
export async function playSequence(notes, length, delay=0){
    if(playing) return;
    playing = true;

    for(let i = 0; i < notes.length; i++){
        await play(noteToFreq(notes[i]));
        await sleep(length);
        await stop();
        await sleep(delay);
    }

    playing = false;
}

export async function playChord(tones, length){
    if(playing) return;
    playing = true;

    for(let i = 0; i < tones.length; i++)
        await play(noteToFreq(tones[i]));
    await sleep(length);
    await stop();

    playing = false;
}
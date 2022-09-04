//Created on the 06.08.2022 (and the following days) by Yannis Paul 

//IDEA: generate notes based on certain parameters (put the chords and relations in a external json file)
// possible parameters: 
//      - last chord
//      - TODO: chord position (phrases mainly in a multiple of 4)
//      - spyciness -> dont overuse spice
//      - IMPORTANT TODO: tonal center

//maybe add different playing modes? -> (arpedgiated, etc...)

//Idea: find a chord that can be voicelead best

//IDEA 2: generate melodies and countermelodies based on that (use Wave Function Collapse?)

var gen;

var volSlide;

async function onload(){
    gen = await new Generator("./MusicInfo.json");

    let volSlide = document.getElementById("volumeSlide")
    volSlide.oninput = function() { setVol(volSlide.value / 100.0 + 0.00001); }
    
    document.getElementById("generateB").onclick = async function() { await playChord(gen.generate(), 0.4); };
}
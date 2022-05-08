import {generate as generateSentence} from "./Generator.js";
var textOJ;
document.getElementById("generateB").onclick = function() { generate(); };

loaded();

async function loaded(){
    textOJ = document.getElementById("text");
    generate();
}

function generate(){
    textOJ.innerHTML = generateSentence();
}
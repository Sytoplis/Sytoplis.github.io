import {generate as generateSentence, fetchWords} from "../Generator.js";
await fetchWords('../Words.json');

var textOJ;
document.getElementById("generateB").onclick = function() { generate(); };

loaded();

async function loaded(){
    textOJ = document.getElementById("text");
    generate();
}

function pickMethod(Words, category){

}

function generate(){
    textOJ.innerHTML = "not working jet";
}
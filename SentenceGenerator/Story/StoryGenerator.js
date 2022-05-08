import { generate as generateSentence} from "../Generator.js";
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
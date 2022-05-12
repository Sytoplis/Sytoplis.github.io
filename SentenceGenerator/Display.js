import Generator from "./Generator.js";
var gen = await new Generator("./Words.json");

var textOJ;
document.getElementById("generateB").onclick = function() { generate(); };

loaded();

function loaded(){
    textOJ = document.getElementById("text");
    generate();
}

function generate(){
    textOJ.innerHTML = gen.generate();
}
import StoryGenerator from "./StoryGenerator.js";
var gen = await new StoryGenerator("../Words.json");

var textOJ;
document.getElementById("generateB").onclick = function() { generate(); };

loaded();

function loaded(){
    textOJ = document.getElementById("text");
    generate();
}

function generate(){
    let sentenceCount = document.getElementById("SentenceCount").value;
    textOJ.innerHTML = gen.generateStory(sentenceCount);
}
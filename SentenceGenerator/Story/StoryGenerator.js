import {generate as genSentence, pickRandom, fetchWords, setAdjProb} from "../Generator.js";
await fetchWords('../Words.json');
setAdjProb(0);//disable random adjectives -> add them to generated objects and characters

var textOJ;
document.getElementById("generateB").onclick = function() { generate(); };

loaded();

async function loaded(){
    textOJ = document.getElementById("text");
    generate();
}


//array of Actors sorted by importance (first character -> main char)
var Chars;
var Objs;

function pickMethod(Words, category){
    if(category == "Character"){
        //TODO: pick a character with lowering probability, the higher the index is
        //TODO: if the list doesnt have this character jet, add the character (maybe add also a fixed adjective)
    }

    if(category == "Object"){
        //TODO: analog to character
    }

    //else:
    return pickRandom(Words[category]);
}

function generate(){
    let sentenceCount = document.getElementById("SentenceCount").value;
    let result = "";
    for(let i = 0; i < sentenceCount; i++){
        result += genSentence(pickMethod) + " ";
    }
    textOJ.innerHTML = result;
}
//Noun-Source: https://eslgrammar.org/list-of-nouns/ 
//Verb-Source: https://www.englishbix.com/verb-forms-v1-v2-v3-list/
//Adjective-Source: https://www.mobap.edu/wp-content/uploads/2013/01/list_of_adjectives.pdf
var Words;
var adjectiveProb = 0.1;

export async function fetchWords(path) {
    let response = await fetch(path);//use absolute path to always find words
    Words = await response.json();
}
//await fetchWords();//ALWAYS load the word data first (also when imported)


function RndInt(count) { return Math.floor(Math.random()*count); }
export function pickRandom(array){ return array[RndInt(array.length)]; }


export function generate(){
    return toSentence(fillTemplate(pickRandom(Words.Template)));
}

export default function fillTemplate(text, pickMethod = function(W, c) { return pickRandom(W[c]); }){
    let i = text.indexOf("@");
    while(i != -1){
        let s = findNextNonLetter(text, i+1);//get next non-letter character
        if(s == -1) s = text.length;

        let category = text.substring(i+1, s);

        let insert = "";
        switch(category){
            default:
                insert = pickMethod(Words, category);
                break;
        }
        
        insert = fillTemplate(insert);//resolve everything that might be inside it

        text = text.substring(0, i) + insert + text.substring(s, text.length);
        i = text.indexOf("@");//get next insert
    }


    i = text.indexOf("#");//find the second processing prompts
    while(i != -1){
        let s = findNextNonLetter(text, i+1);//get next non-letter character
        if(s == -1) s = text.length;

        let category = text.substring(i+1, s);

        let insert = "";
        let next = text.substring(s+1, text.length);//skip space
        switch(category){
            case "A":
                insert = getArticle(next);//article with no adjective
            case "Aadj":
                insert = getArticleAdj(next);//article with sometimes an adjective
        }

        insert = fillTemplate(insert);//resolve everything that might be inside it

        text = text.substring(0, i) + insert + text.substring(s, text.length);
        i = text.indexOf("#");//get next insert
    }
    
    return text;
}

  
function getArticle(next){
    let firstChar = next.charAt(0);
    if("aeiou".includes(firstChar)){//if character is a noun
        if(RndInt(2) == 1){
            return "the";
        }else{
            return "an"
        }
    }else{
        if(RndInt(2) == 1){
            return "the";
        }else{
            return "a"
        }
    }
}

function getArticleAdj(next){
    if(Math.random() < adjectiveProb){//rng, if adjective
        let adj = pickRandom(Words.Adjective);
        return getArticle(adj) + " " + adj;
    }else{
        return getArticle(next);
    }    
}

function findNextNonLetter(text, startI){
    for(let i = startI; i < text.length; i++){
        if(/[^\w]/g.test(text[i]))//test, if text is a non letter character
            return i;
    }
    return -1;
}

function toSentence(text){ return text.substring(0, 1).toUpperCase() + text.substring(1, text.length) + "."; }